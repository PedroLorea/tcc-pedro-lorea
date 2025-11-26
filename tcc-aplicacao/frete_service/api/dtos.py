from datetime import datetime
from decimal import Decimal
from typing import Optional
from pydantic import BaseModel
from enum import Enum

from api.constants import FRETE_STATUS_AGUARDANDO_COLETA, FRETE_STATUS_AGUARDANDO_DECISAO, FRETE_STATUS_AGUARDANDO_PAGAMENTO, FRETE_STATUS_EM_ANALISE, FRETE_STATUS_EM_ANDAMENTO, FRETE_STATUS_FINALIZADO, FRETE_STATUS_RECUSADO, TIPO_PRODUTO_AGUARRAS, TIPO_PRODUTO_BENZENO, TIPO_PRODUTO_BIODIESEL, TIPO_PRODUTO_CHILENO, TIPO_PRODUTO_ESTIRENO, TIPO_PRODUTO_ETANOL, TIPO_PRODUTO_GASOLINA, TIPO_PRODUTO_GLICERINA, TIPO_PRODUTO_HEXANO, TIPO_PRODUTO_METANOL, TIPO_PRODUTO_OLEO_DIESEL, TIPO_PRODUTO_OLEO_MINERAL, TIPO_PRODUTO_SOLVENTE_C6, TIPO_PRODUTO_TOLUENO, UNIDADE_OPERACIONAL_STATUS_DISPONIVEL, UNIDADE_OPERACIONAL_STATUS_EM_TRANSPORTE, UNIDADE_OPERACIONAL_STATUS_INDISPONIVEL, UNIDADE_OPERACIONAL_STATUS_RESERVADO


class TiposProdutosEnum(str, Enum):
    PRODUTO_CHILENO = TIPO_PRODUTO_CHILENO
    PRODUTO_TOLUENO = TIPO_PRODUTO_TOLUENO
    PRODUTO_HEXANO = TIPO_PRODUTO_HEXANO
    PRODUTO_BENZENO = TIPO_PRODUTO_BENZENO
    PRODUTO_SOLVENTE_C6 = TIPO_PRODUTO_SOLVENTE_C6
    PRODUTO_AGUARRAS = TIPO_PRODUTO_AGUARRAS
    PRODUTO_GASOLINA = TIPO_PRODUTO_GASOLINA
    PRODUTO_METANOL = TIPO_PRODUTO_METANOL
    PRODUTO_ETANOL = TIPO_PRODUTO_ETANOL
    PRODUTO_GLICERINA = TIPO_PRODUTO_GLICERINA
    PRODUTO_BIODIESEL = TIPO_PRODUTO_BIODIESEL
    PRODUTO_ESTIRENO = TIPO_PRODUTO_ESTIRENO
    PRODUTO_OLEO_DIESEL = TIPO_PRODUTO_OLEO_DIESEL
    PRODUTO_OLEO_MINERAL = TIPO_PRODUTO_OLEO_MINERAL

class UnidadeOperacionalStatusEnum(str, Enum):
    UNIDADE_STATUS_DISPONIVEL = UNIDADE_OPERACIONAL_STATUS_DISPONIVEL
    UNIDADE_STATUS_RESERVADO = UNIDADE_OPERACIONAL_STATUS_RESERVADO
    UNIDADE_STATUS_INDISPONIVEL = UNIDADE_OPERACIONAL_STATUS_INDISPONIVEL
    UNIDADE_STATUS_EM_TRANSPORTE = UNIDADE_OPERACIONAL_STATUS_EM_TRANSPORTE

class FreteStatusEnum(str, Enum):
    EM_ANALISE = FRETE_STATUS_EM_ANALISE
    AGUARDANDO_DECISAO = FRETE_STATUS_AGUARDANDO_DECISAO
    AGUARDANDO_PAGAMENTO = FRETE_STATUS_AGUARDANDO_PAGAMENTO
    AGUARDANDO_COLETA = FRETE_STATUS_AGUARDANDO_COLETA
    EM_ANDAMENTO = FRETE_STATUS_EM_ANDAMENTO
    FINALIZADO = FRETE_STATUS_FINALIZADO
    RECUSADO = FRETE_STATUS_RECUSADO


class LocalizacaoDTO(BaseModel):
    cep: str
    cidade: str
    estado: str
    rua: str
    numero: int
    complemento: Optional[str] = None


class CaminhaoDTO(BaseModel):
    uuid: Optional[str] = None
    placa: str
    marca: str
    modelo: str
    ano_fabricacao: datetime
    peso: int
    altura: float
    capacidade: float
    localizacao_atual: Optional[LocalizacaoDTO] = None
    material_reservatorio: Optional[str] = None
    data_ultima_viagem: Optional[datetime] = None
    status: Optional[UnidadeOperacionalStatusEnum] = None


class ClienteDTO(BaseModel):
    uuid: Optional[str] = None
    email: str
    cnpj: str
    nome_empresa: str
    telefone: str


class MotoristaDTO(BaseModel):
    uuid: Optional[str] = None
    email: str
    cpf: str
    nome: str
    telefone: str
    cnh: Optional[str] = None
    data_ultima_viagem: Optional[datetime] = None
    status: Optional[UnidadeOperacionalStatusEnum] = None


class FreteDTO(BaseModel):
    uuid: Optional[str] = None  
    tipo_produto: Optional[TiposProdutosEnum] = None
    quantidade: Optional[int] = None
    localizacao_coleta: Optional[LocalizacaoDTO] = None
    localizacao_entrega: Optional[LocalizacaoDTO] = None
    data_coleta: Optional[datetime] = None
    data_entrega: Optional[datetime] = None
    preco: Optional[Decimal] = None
    status: Optional[FreteStatusEnum] = None
    codigo_entrega: Optional[str] = None

    cliente: Optional[ClienteDTO] = None
    motorista: Optional[MotoristaDTO] = None
    caminhao: Optional[CaminhaoDTO] = None


class FreteStatusDTO(BaseModel):
    status: FreteStatusEnum
    codigo: Optional[str] = None

class FreteDecisaoDTO(BaseModel):
    decisao: bool
    
class FreteOrcamentoDTO(BaseModel):
    preco: Decimal