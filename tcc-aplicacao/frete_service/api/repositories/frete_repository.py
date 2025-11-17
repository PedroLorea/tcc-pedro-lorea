from typing import List, Tuple
from api.dtos import FreteDTO
from api.models import Frete
from api.repositories.localizacao_repository import LocalizacaoRepository


class FreteRepository:

    localizacao_repository = LocalizacaoRepository()

    def get_all(self) -> List[Frete]:
        return list(Frete.objects.all())

    def get_by_uuid(self, uuid: str) -> Frete | None:
        return Frete.objects.filter(uuid=uuid).first()
    
    def create(self, frete_dto: FreteDTO) -> Tuple[Frete, bool]:

        localizacao_coleta = self.localizacao_repository.update_or_create(localizacao_dto=frete_dto.localizacao_coleta)
        localizacao_entrega = self.localizacao_repository.update_or_create(localizacao_dto=frete_dto.localizacao_entrega)

        frete_dump = {k: v for k, v in frete_dto.model_dump(exclude={'id'}).items() if v is not None}
        frete_dump['localizacao_coleta'] = localizacao_coleta
        frete_dump['localizacao_entrega'] = localizacao_entrega
        frete = Frete.objects.create(**frete_dump)

        return frete

    def delete(self, uuid: str) -> bool:
        frete = self.get_by_uuid(uuid=uuid)
        if frete:
            frete.delete()
            return True
        return False