from django.db import models

from api.base.base_model import CustomBaseModel

class Rastreamento(CustomBaseModel):
    frete_uuid = models.CharField(max_length=64)
    caminhao_uuid = models.CharField(max_length=64)
    latitude = models.DecimalField(max_digits=9, decimal_places=6)
    longitude = models.DecimalField(max_digits=9, decimal_places=6)
    timestamp = models.DateTimeField()