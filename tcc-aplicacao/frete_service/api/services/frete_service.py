from typing import List, Tuple
from api.base.exceptions import FreteNotFoundError, PagamentoServiceError, UnidadeOperacionalIndisponivelError
from api.constants import FRETE_STATUS_AGUARDANDO_COLETA, FRETE_STATUS_AGUARDANDO_DECISAO, FRETE_STATUS_AGUARDANDO_PAGAMENTO, FRETE_STATUS_EM_ANDAMENTO, FRETE_STATUS_FINALIZADO, PAGAMENTO_SERVICE_URL, RASTREAMENTO_SERVICE_URL, UNIDADE_OPERACIONAL_STATUS_EM_TRANSPORTE, UNIDADE_OPERACIONAL_STATUS_RESERVADO
from api.dtos import FreteDTO, FreteDecisaoDTO, FreteOrcamentoDTO, FreteStatusDTO
from api.models import Caminhao, Frete, Motorista
from api.repositories.caminhao_repository import CaminhaoRepository
from api.repositories.frete_repository import FreteRepository
from api.repositories.motorista_repository import MotoristaRepository
from api.util.model_to_dto import model_to_dto
from api.messaging.message_consumer import MessageConsumer
from api.messaging.message_publisher import MessagePublisher
import requests

class FreteService:

    frete_repository = FreteRepository()
    motorista_repository = MotoristaRepository()
    caminhao_repository = CaminhaoRepository()
    consumer = MessageConsumer()
    message_publisher = MessagePublisher()

    def __init__(self):
        self.frete_repository = FreteRepository()
        self.motorista_repository = MotoristaRepository()
        self.caminhao_repository = CaminhaoRepository()

        self.consumer = MessageConsumer()

        self.consumer.subscribe(
            queue='pagamento_confirmado_queue',
            routing_key='pagamento.pago'
        )(self.handle_pagamento_confirmado)

        import threading
        t = threading.Thread(target=self.consumer.start, daemon=True)
        t.start()

        print("[🚀] MessageConsumer iniciado em background.")


    def get_fretes_list(self) -> List[FreteDTO]:
        fretes = self.frete_repository.get_all()
        fretes_dto = [model_to_dto(frete, FreteDTO).model_dump() for frete in fretes]
        return fretes_dto

    def get_frete_detalhes(self, frete_uuid: str) -> FreteDTO:
        frete = self.frete_repository.get_by_uuid(uuid=frete_uuid)

        if frete is None:
                raise FreteNotFoundError()
        
        frete_dto = model_to_dto(frete, FreteDTO).model_dump()
        return frete_dto

    def get_frete_solicitacao(self, frete_dto: FreteDTO, user_id: str) -> Frete:
        
        motorista, caminhao = self.verifica_e_reserva_unidade()

        frete = self.frete_repository.create(frete_dto=frete_dto)

        frete.motorista = motorista
        frete.caminhao = caminhao
        frete.save()

        self.message_publisher.publish(
            routing_key="notifica.plataforma",
            body={
                "user_id": str(user_id),
                "frete_uuid": str(frete.uuid),
                "message": "O cliente solicitou um frete e aguarda o orçamento.",
                "title": f"TO: TRANSPORTADORA — {frete.uuid}"
            }
        )

        return frete

    def verifica_e_reserva_unidade(self) -> Tuple[Motorista, Caminhao]:
        motorista = self.motorista_repository.get_motorista_disponivel()
        caminhao = self.caminhao_repository.get_caminhao_disponivel()

        if(not motorista or not caminhao):
            raise UnidadeOperacionalIndisponivelError()
        
        motorista.status = UNIDADE_OPERACIONAL_STATUS_RESERVADO
        caminhao.status = UNIDADE_OPERACIONAL_STATUS_RESERVADO
        motorista.save()
        caminhao.save()

        return motorista, caminhao
    
    def get_altera_status(self, frete_uuid: str, status_dto: FreteStatusDTO, user_id: str) -> Frete:

        frete = self.frete_repository.get_by_uuid(uuid=frete_uuid)

        if not frete:
            raise FreteNotFoundError()

        frete.status = status_dto.status
        frete.save()

        if status_dto.status == FRETE_STATUS_EM_ANDAMENTO:
            self.message_publisher.publish(
                routing_key="notifica.plataforma",
                body={
                    "user_id": str(user_id),
                    "frete_uuid": str(frete.uuid),
                    "message": "O pedido foi coletado.",
                    "title": f"TO: CLIENTE — {str(frete.uuid)}"
                }
            )

            try:
                payload = {
                    "caminhao_uuid": str(getattr(frete, "caminhao_uuid", "simulado")),
                    "ponto_inicial": {"latitude": -23.5505, "longitude": -46.6333},
                    "ponto_final": {"latitude": -22.9068, "longitude": -43.1729},
                }

                url = f"{RASTREAMENTO_SERVICE_URL}{frete.uuid}/"
                response = requests.post(url, json=payload, timeout=5)

                if response.status_code not in (200, 201):
                    print(f"[Rastreamento] Erro ao iniciar rastreamento: {response.status_code} - {response.text}")
                else:
                    print(f"[Rastreamento] Rastreamento iniciado via endpoint para frete {frete.uuid}")

            except requests.RequestException as e:
                print(f"[Erro] Falha ao chamar serviço de rastreamento: {e}")

        else:
            frete.motorista.status = UNIDADE_OPERACIONAL_STATUS_DISPONIVEL
            frete.caminhao.status = UNIDADE_OPERACIONAL_STATUS_DISPONIVEL

            self.message_publisher.publish(
                routing_key="notifica.plataforma",
                body={
                    "user_id": str(user_id),
                    "frete_uuid": str(frete.uuid),
                    "message": "O pedido foi entregue.",
                    "title": f"TO: CLIENTE — {str(frete.uuid)}"
                }
            )



        return frete
    
    def get_frete_decisao(self, frete_uuid: str, decisao_dto: FreteDecisaoDTO) -> Frete:

        frete = self.frete_repository.get_by_uuid(uuid=frete_uuid)

        if not frete:
            raise FreteNotFoundError()
        
        if decisao_dto.decisao is False:
            frete.status = FRETE_STATUS_FINALIZADO
            frete.save()
            return frete
        
        pagamento = self.get_create_pagamento(frete=frete)

        if not pagamento:
            raise PagamentoServiceError()
        
        frete.status = FRETE_STATUS_AGUARDANDO_PAGAMENTO
        frete.save()
        
        return frete
    

    def get_create_pagamento(self, frete: str):

        payload = {
            "frete_uuid": str(frete.uuid),
            "preco": float(frete.preco or 0),
        }

        try:
            response = requests.post(
                PAGAMENTO_SERVICE_URL,
                json=payload,
                timeout=5,
            )

            if response.status_code != 201:
                raise PagamentoServiceError(
                    f"Erro ao criar pagamento: {response.status_code} - {response.text}"
                )

            return response.json()

        except requests.RequestException as e:
            raise PagamentoServiceError(f"Erro de conexão com o serviço de Pagamento: {e}")

    

    def get_frete_orcamento(self, frete_uuid: str, orcamento_dto: FreteOrcamentoDTO, user_id: str) -> Frete:

        frete = self.frete_repository.get_by_uuid(uuid=frete_uuid)

        if not frete:
            raise FreteNotFoundError()
        
        frete.preco = orcamento_dto.preco
        frete.status = FRETE_STATUS_AGUARDANDO_DECISAO
        frete.save()

        self.message_publisher.publish(
            routing_key="notifica.plataforma",
            body={
                "frete_preco": str(frete.preco),
                "user_id": str(user_id),
                "frete_uuid": str(frete.uuid),
                "message": "A transportadora gerou o orçamento para o frete.",
                "title": f"TO: CLIENTE — {str(frete.uuid)}"
            }
        )

        return frete
    

    def get_pagamento_realizado(self, frete_uuid: str, user_id: str) -> Frete:

        frete = self.frete_repository.get_by_uuid(uuid=frete_uuid)

        if not frete:
            raise FreteNotFoundError()
        
        self.get_seleciona_unidade_operacional(frete=frete, user_id=user_id)

        #TODO: Notificação to Cliente (com código)

        frete.status = FRETE_STATUS_AGUARDANDO_COLETA
        frete.save()



    def get_seleciona_unidade_operacional(self, frete: Frete, user_id: str) -> Frete:


        #TODO: Notificação to Motorista

        frete.motorista.status = UNIDADE_OPERACIONAL_STATUS_EM_TRANSPORTE
        frete.caminhao.status = UNIDADE_OPERACIONAL_STATUS_EM_TRANSPORTE

        self.message_publisher.publish(
            routing_key="notifica.plataforma",
            body={
                "user_id": user_id, 
                "message": (
                    f"Você foi selecionado para fazer um frete. "
                    f"Pegue o caminhão: {frete.caminhao.placa} "
                    f"e dirija até o local de coleta: {frete.localizacao_coleta.cidade}."
                ),
                "title": f"TO: MOTORISTA — {str(frete.uuid)}"
            }
        )

        frete.save()


    def handle_pagamento_confirmado(self, msg):
        print(f"[x] Recebido evento de pagamento: {msg}")

        frete_uuid = msg['frete_uuid']
        codigo_entrega = msg['codigo_entrega']
        user_id = msg['user_id']

        frete = self.frete_repository.get_by_uuid(uuid=frete_uuid)

        if not frete:
            raise FreteNotFoundError()      
        
        self.get_seleciona_unidade_operacional(frete=frete, user_id=user_id)

        frete.codigo_entrega = codigo_entrega
        frete.status = FRETE_STATUS_AGUARDANDO_COLETA
        frete.save()


