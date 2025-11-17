from api.base.custom_api_view import CustomAPIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from api.services.frete_service import FreteService
from api.dtos import FreteDecisaoDTO, FreteOrcamentoDTO, FreteStatusDTO, FreteDTO
from api.constants import FRETE_STATUS_AGUARDANDO_PAGAMENTO, FRETE_STATUS_AGUARDANDO_DECISAO

frete_service = FreteService()

class FreteSolicitacaoView(CustomAPIView):

    input_dto = FreteDTO
    permission_classes = [IsAuthenticated]

    def post(self, request):

        user = request.user
        print("Usuário autenticado:", user.__dict__)

        input_dto = self.validate_dto(data=request.data)

        frete = frete_service.get_frete_solicitacao(frete_dto=input_dto, user_id=user.id)

        return Response(data={"message": "Frete criado com sucesso", "uuid": frete.uuid}, status=201)
    

class FreteListView(CustomAPIView):

    def get(self, request):

        fretes = frete_service.get_fretes_list()

        return Response(data=fretes)

class FreteDetalhesView(CustomAPIView):

    def get(self, request, frete_uuid: str):

        frete = frete_service.get_frete_detalhes(frete_uuid=frete_uuid)

        return Response(data=frete)
    

class FreteAlteracaoStatus(CustomAPIView):

    input_dto = FreteStatusDTO

    def put(self, request, frete_uuid: str):

        print("entrou altera status")

        frete_status_dto = self.validate_dto(data=request.data)

        frete = frete_service.get_altera_status(frete_uuid=frete_uuid, status_dto=frete_status_dto, user_id=request.user.id)

        return Response(data={"message": "Frete Status atualizado com sucesso", "uuid": frete.uuid, "Status": frete.status}, status=200)


class FreteDecisaoView(CustomAPIView):

    input_dto = FreteDecisaoDTO

    def put(self, request, frete_uuid: str):

        frete_decisao_dto = self.validate_dto(data=request.data)

        frete = frete_service.get_frete_decisao(frete_uuid=frete_uuid, decisao_dto=frete_decisao_dto)

        message = "Frete aceito com sucesso. Agurdando pagamento" if frete.status == FRETE_STATUS_AGUARDANDO_PAGAMENTO else "Frete recusado"

        return Response(data={"message": message, "uuid": frete.uuid, "Status": frete.status}, status=200)
    

class FreteOrcamentoView(CustomAPIView):

    input_dto = FreteOrcamentoDTO

    def put(self, request, frete_uuid: str):

        frete_orcamento_dto = self.validate_dto(data=request.data)

        print("request.user: ", request.user)

        frete = frete_service.get_frete_orcamento(frete_uuid=frete_uuid, orcamento_dto=frete_orcamento_dto, user_id=request.user.id)

        message = "Orçamento do Frete gerado com sucesso. Agurdando decisão do cliente." if frete.status == FRETE_STATUS_AGUARDANDO_DECISAO else "Erro ao gerar orçamento"

        return Response(data={"message": message, "uuid": frete.uuid, "Status": frete.status}, status=200)