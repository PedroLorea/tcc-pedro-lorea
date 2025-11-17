from api.dtos import RastreamentoDTO
from api.models import Rastreamento


class RastreamentoRepository:

    def create(self, rastreamento_dto: RastreamentoDTO) -> Rastreamento:

        rastreamento_dump = rastreamento_dto.model_dump(exclude={'uuid'})
        rastreamento = Rastreamento.objects.create(**rastreamento_dump)

        return rastreamento

    def get_by_uuid(self, uuid) -> Rastreamento:
        return Rastreamento.objects.filter(uuid=uuid).first()