from api.base.custom_api_view import CustomAPIView
from api.dtos import PagamentoDTO
from api.services.pagamento_service import PagamentoService
from rest_framework import status

from rest_framework.response import Response

pagamento_service = PagamentoService()

class PagamentoListView(CustomAPIView):

    def get(self, request):

        pagamentos = pagamento_service.get_pagamento_list()

        return Response(data=pagamentos)
    
class PagamentoDetalhesView(CustomAPIView):

    def get(self, request, frete_uuid: str):

        pagamento = pagamento_service.get_pagamento_detalhes(frete_uuid=frete_uuid)

        return Response(data=pagamento)


class PagamentoCreateView(CustomAPIView): 

    input_dto = PagamentoDTO

    def post(self, request):

        input_dto = self.validate_dto(data=request.data)

        pagamento = pagamento_service.get_pagamento_create(pagamento_dto=input_dto)
        
        return Response(data={"message": "Pagamento criado com sucesso.", "pagamento_uuid": pagamento.uuid}, status=status.HTTP_201_CREATED)


class PagamentoPagarView(CustomAPIView): 

    def post(self, request, pagamento_uuid: str):

        pagamento = pagamento_service.get_pagamento_pagar(pagamento_uuid=pagamento_uuid, user_id=request.user.id)

        return Response(data={"message": "Pago com sucesso."})
    