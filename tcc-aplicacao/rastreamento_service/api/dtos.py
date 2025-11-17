import datetime
from decimal import Decimal
from typing import Optional
from pydantic import BaseModel


class RastreamentoDTO(BaseModel):
    frete_uuid: Optional[str]
    caminhao_uuid: str
    latitude: Decimal
    longitude: Decimal
    timestamp: datetime