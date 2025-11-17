from api.constants import UNIDADE_OPERACIONAL_STATUS_DISPONIVEL
from api.models import Caminhao
from api.dtos import CaminhaoDTO


class CaminhaoRepository:

    def get_caminhao_disponivel(self) -> Caminhao:
        return Caminhao.objects.filter(status=UNIDADE_OPERACIONAL_STATUS_DISPONIVEL).first()
    
    def create(self, caminhao_dto: CaminhaoDTO) -> Caminhao:

        defaults = caminhao_dto.model_dump(exclude={"uuid"})

        caminhao = Caminhao.objects.create(**defaults)

        return caminhao