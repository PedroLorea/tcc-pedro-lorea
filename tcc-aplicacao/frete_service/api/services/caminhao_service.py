from api.dtos import CaminhaoDTO
from api.repositories.caminhao_repository import CaminhaoRepository


class CaminhaoService:

    caminhao_repository = CaminhaoRepository()

    def get_caminhao_create(self, caminhao_dto: CaminhaoDTO):
        return self.caminhao_repository.create(caminhao_dto=caminhao_dto)