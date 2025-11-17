from typing import Tuple
from api.dtos import LocalizacaoDTO
from api.models import Localizacao


class LocalizacaoRepository:

    def update_or_create(self, localizacao_dto: LocalizacaoDTO) -> Tuple[Localizacao, bool]:

        defaults = localizacao_dto.model_dump(exclude={"cep", "numero"})

        localizacao, created = Localizacao.objects.update_or_create(
            cep=localizacao_dto.cep,
            numero=localizacao_dto.numero,
            defaults=defaults
        )

        return localizacao