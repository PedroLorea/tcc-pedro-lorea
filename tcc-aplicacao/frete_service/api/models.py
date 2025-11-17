from django.db import models

from django.db import models

from api.constants import FRETE_STATUS_EM_ANALISE, FRETES_STATUS, RESERVATORIOS_MATERIAIS, TIPOS_PRODUTOS, UNIDADE_OPERACIONAL_STATUS_DISPONIVEL, UNIDADE_OPERACIONAL_STATUS
from api.base.base_model import BaseModel

class Localizacao(BaseModel):
    cep = models.CharField(max_length=9)
    cidade = models.CharField(max_length=100)
    estado = models.CharField(max_length=2)
    rua = models.CharField(max_length=100)
    numero = models.IntegerField()
    complemento = models.CharField(max_length=100, blank=True, null=True)


class Cliente(BaseModel):
    email = models.CharField(max_length=100)
    cnpj = models.CharField(max_length=18)
    nome_empresa = models.CharField(max_length=100)
    telefone = models.CharField(max_length=20)


class Caminhao(BaseModel):
    placa = models.CharField(max_length=10)
    marca = models.CharField(max_length=100)
    modelo = models.CharField(max_length=100)
    ano_fabricacao = models.DateField()
    peso = models.IntegerField()
    altura = models.FloatField()
    capacidade = models.FloatField()
    localizacao_atual = models.ForeignKey(Localizacao, on_delete=models.CASCADE, related_name="localizao_atual", null=True)
    material_reservatorio = models.CharField(max_length=100, choices=RESERVATORIOS_MATERIAIS)
    data_ultima_viagem = models.DateTimeField(null=True) 
    status = models.CharField(max_length=50, choices=UNIDADE_OPERACIONAL_STATUS, default=UNIDADE_OPERACIONAL_STATUS_DISPONIVEL)


class Motorista(BaseModel):
    email = models.CharField(max_length=100)
    cpf = models.CharField(max_length=18)
    nome = models.CharField(max_length=100)
    telefone = models.CharField(max_length=20)
    cnh = models.CharField(max_length=15, blank=True)
    data_ultima_viagem = models.DateTimeField(null=True) 
    status = models.CharField(max_length=50, choices=UNIDADE_OPERACIONAL_STATUS, default=UNIDADE_OPERACIONAL_STATUS_DISPONIVEL)


class Frete(BaseModel):
    tipo_produto = models.CharField(max_length=50, choices=TIPOS_PRODUTOS, null=True)
    quantidade = models.IntegerField(null=True)
    localizacao_coleta = models.ForeignKey(Localizacao, on_delete=models.CASCADE, related_name="localizacao_coleta", null=True)
    localizacao_entrega = models.ForeignKey(Localizacao, on_delete=models.CASCADE, related_name="localizacao_entrega", null=True)
    data_coleta = models.DateTimeField(null=True)
    data_entrega = models.DateTimeField(null=True)
    preco = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    status = models.CharField(max_length=50, choices=FRETES_STATUS, default=FRETE_STATUS_EM_ANALISE)
    codigo_entrega = models.CharField(max_length=6, null=True)

    cliente = models.ForeignKey(Cliente, on_delete=models.CASCADE, related_name="cliente", null=True)
    motorista = models.ForeignKey(Motorista, on_delete=models.CASCADE, related_name="motorista", null=True)
    caminhao = models.ForeignKey(Caminhao, on_delete=models.CASCADE, related_name="caminhao", null=True)
