from typing import List
from api.dtos import PagamentoDTO
from api.models import Pagamento
from api.constants import PAGAMENTO_STATUS_AGUARDANDO_PAGAMENTO


class PagamentoRepository:

    def get_all(self) -> List[Pagamento]:
        return list(Pagamento.objects.all())
    
    def get_by_uuid(self, uuid: str) -> Pagamento | None:

        return Pagamento.objects.filter(uuid=uuid).first()
    
    def get_by_frete_uuid(self, frete_uuid: str) -> Pagamento | None:

        print("frete_uuid: ", frete_uuid)
        return Pagamento.objects.filter(frete_uuid=frete_uuid).first()

    def create(self, pagamento_dto: PagamentoDTO) -> Pagamento:

        if 'status' not in pagamento_dto:
            pagamento_dto.status = PAGAMENTO_STATUS_AGUARDANDO_PAGAMENTO

        pagamento_dump = pagamento_dto.model_dump()

        pagamento = Pagamento.objects.create(**pagamento_dump)

        return pagamento
    
