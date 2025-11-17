import random
from typing import List
from api.base.exceptions import PagamentoNotFoundError
from api.constants import PAGAMENTO_STATUS_PAGO
from api.dtos import PagamentoDTO
from api.messaging.message_publisher import MessagePublisher
from api.models import Pagamento
from api.repositories.pagamento_repository import PagamentoRepository
from api.util.model_to_dto import model_to_dto


class PagamentoService:

    pagamento_repository = PagamentoRepository()
    message_publisher = MessagePublisher()

    def get_pagamento_list(self) -> List[PagamentoDTO]:

        pagamentos = self.pagamento_repository.get_all()
        pagamentos_dto = [model_to_dto(model_instance=pagamento, dto_class=PagamentoDTO).model_dump() for pagamento in pagamentos]
        return pagamentos_dto
    
    def get_pagamento_detalhes(self, frete_uuid: str) -> PagamentoDTO:
        pagamento = self.pagamento_repository.get_by_frete_uuid(frete_uuid=frete_uuid)

        if pagamento is None:
                raise PagamentoNotFoundError()
        
        return model_to_dto(pagamento, PagamentoDTO).model_dump()

    def get_pagamento_create(self, pagamento_dto: PagamentoDTO) -> Pagamento:

        return self.pagamento_repository.create(pagamento_dto=pagamento_dto)
    

    def get_pagamento_pagar(self, pagamento_uuid: str, user_id: str) -> Pagamento:

        pagamento = self.pagamento_repository.get_by_uuid(uuid=pagamento_uuid)

        if not pagamento:
            PagamentoNotFoundError()

        codigo_entrega = random.randint(100000, 999999)
        pagamento.codigo_entrega = str(codigo_entrega)

        pagamento.status = PAGAMENTO_STATUS_PAGO
        pagamento.save()

        self.message_publisher.publish(
            exchange="pagamentos",  # 🔹 publica no exchange de pagamentos
            routing_key="pagamento.pago",
            body={
                "user_id": user_id,
                "frete_uuid": str(pagamento.frete_uuid),
                "codigo_entrega": str(codigo_entrega),
            }
        )

        print("user_id: ", user_id)

        self.message_publisher.publish(
            exchange="notificacoes",  # 🔹 publica no exchange de notificações
            routing_key="notifica.plataforma",
            body={
                "user_id": user_id,
                "message": "O cliente pagou o frete.",
                "title": "TO: TRANSPORTADORA",
            }
        )


        return pagamento
