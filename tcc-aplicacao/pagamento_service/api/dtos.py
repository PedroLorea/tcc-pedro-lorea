from decimal import Decimal
from enum import Enum
from typing import Optional

from pydantic import BaseModel

from api.constants import PAGAMENTO_STATUS_AGUARDANDO_PAGAMENTO, PAGAMENTO_STATUS_EXPIRADO, PAGAMENTO_STATUS_PAGO


class PagamentoStatusEnum(str, Enum):
    PAGAMENTO_STATUS_AGUARDANDO_PAGAMENTO = PAGAMENTO_STATUS_AGUARDANDO_PAGAMENTO
    PAGAMENTO_STATUS_EXPIRADO = PAGAMENTO_STATUS_EXPIRADO
    PAGAMENTO_STATUS_PAGO = PAGAMENTO_STATUS_PAGO

class PagamentoDTO(BaseModel):
    uuid: Optional[str] = None  
    frete_uuid: str
    preco: Decimal
    codigo_entrega: Optional[str] = None
    status: Optional[PagamentoStatusEnum] = None