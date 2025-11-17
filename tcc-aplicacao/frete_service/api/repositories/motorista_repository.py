from api.constants import UNIDADE_OPERACIONAL_STATUS_DISPONIVEL
from api.models import Motorista
from api.dtos import MotoristaDTO


class MotoristaRepository:

    def get_motorista_disponivel(self) -> Motorista:
        return Motorista.objects.filter(status=UNIDADE_OPERACIONAL_STATUS_DISPONIVEL).first()
    
    def create(self, motorista_dto: MotoristaDTO) -> Motorista:

        motorista_dump = motorista_dto.model_dump(exclude={"uuid"})

        motorista = Motorista.objects.create(**motorista_dump)

        return motorista