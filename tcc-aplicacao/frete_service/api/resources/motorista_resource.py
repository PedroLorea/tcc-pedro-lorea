from api.base.custom_api_view import CustomAPIView
from api.dtos import MotoristaDTO
from api.services.motorista_service import MotoristaService
from rest_framework.response import Response

motorista_service = MotoristaService()

class MotoristaCreateView(CustomAPIView):

    input_dto = MotoristaDTO

    def post(self, request):

        motorista_dto = self.validate_dto(data=request.data)

        motorista = motorista_service.get_motorista_create(motorista_dto=motorista_dto)

        return Response(data={"message": "Motorista criado com sucesso", "uuid": motorista.uuid}, status=201)

        