from api.base.custom_api_view import CustomAPIView
from api.dtos import CaminhaoDTO
from api.services.caminhao_service import CaminhaoService
from rest_framework.response import Response

caminhao_service = CaminhaoService()

class CaminhaoCreateView(CustomAPIView):

    input_dto = CaminhaoDTO

    def post(self, request):

        caminhao_dto = self.validate_dto(data=request.data)

        caminhao = caminhao_service.get_caminhao_create(caminhao_dto=caminhao_dto)

        return Response(data={"message": "Caminhão criado com sucesso", "uuid": caminhao.uuid}, status=201)

        