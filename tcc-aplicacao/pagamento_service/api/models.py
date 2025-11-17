from django.db import models

from api.base.base_model import CustomBaseModel
from api.constants import PAGAMENTO_STATUS_AGUARDANDO_PAGAMENTO, PAGAMENTOS_STATUS

class Pagamento(CustomBaseModel):
    frete_uuid = models.UUIDField()
    preco = models.DecimalField(max_digits=10, decimal_places=2)
    codigo_entrega = models.CharField(max_length=6, null=True)
    status = models.CharField(max_length=20, choices=PAGAMENTOS_STATUS, default=PAGAMENTO_STATUS_AGUARDANDO_PAGAMENTO)
    