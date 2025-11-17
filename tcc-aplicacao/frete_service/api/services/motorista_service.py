from api.dtos import MotoristaDTO
from api.repositories.motorista_repository import MotoristaRepository


class MotoristaService:

    motorista_repository = MotoristaRepository()

    def get_motorista_create(self, motorista_dto: MotoristaDTO):
        return self.motorista_repository.create(motorista_dto=motorista_dto)