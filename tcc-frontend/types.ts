export interface LocalizacaoDTO {
  cep: string;
  cidade: string;
  estado: string;
  rua: string;
  numero: number;
  complemento?: string;
}

export interface CaminhaoDTO {
  uuid?: string;
  placa: string;
  marca: string;
  modelo: string;
  ano_fabricacao: string; // datetime como string ISO
  peso: number;
  altura: number;
  capacidade: number;
  localizacao_atual?: LocalizacaoDTO;
  material_reservatorio?: string;
  data_ultima_viagem?: string;
  status?: UnidadeOperacionalStatusEnum;
}

export interface ClienteDTO {
  uuid?: string;
  email: string;
  cnpj: string;
  nome_empresa: string;
  telefone: string;
}

export interface MotoristaDTO {
  uuid?: string;
  email: string;
  cpf: string;
  nome: string;
  telefone: string;
  cnh?: string;
  data_ultima_viagem?: string;
  status?: UnidadeOperacionalStatusEnum;
}

export interface FreteDTO {
  uuid?: string;
  tipo_produto?: TiposProdutosEnum;
  quantidade?: number;
  localizacao_coleta?: LocalizacaoDTO;
  localizacao_entrega?: LocalizacaoDTO;
  data_coleta?: string;
  data_entrega?: string;
  preco?: number; // Decimal convertido para number
  status: FreteStatusEnum;
  codigo_entrega?: string;

  cliente?: ClienteDTO;
  motorista?: MotoristaDTO;
  caminhao?: CaminhaoDTO;
}

export interface FreteStatusDTO {
  status: FreteStatusEnum;
}

export interface FreteDecisaoDTO {
  decisao: boolean;
}

export interface FreteOrcamentoDTO {
  preco: number;
}

export interface LoginDTO {
  email: string;
  senha: string;
}

export interface CadastroDTO {
  cnpj: string,
  email: string,
  password: string,
  password2: string,
}

// Enums com valores iguais ao backend
export enum UnidadeOperacionalStatusEnum {
  DISPONIVEL = "DISPONIVEL",
  RESERVADO = "RESERVADO",
  EM_TRANSPORTE = "EM_TRANSPORTE",
  INDISPONIVEL = "INDISPONIVEL",
}

export enum TiposProdutosEnum {
  CHILENO = "CHILENO",
  TOLUENO = "TOLUENO",
  HEXANO = "HEXANO",
  BENZENO = "BENZENO",
  SOLVENTE_C6 = "SOLVENTE_C6",
  AGUARRAS = "AGUARRAS",
  GASOLINA = "GASOLINA",
  METANOL = "METANOL",
  ETANOL = "ETANOL",
  GLICERINA = "GLICERINA",
  BIODIESEL = "BIODIESEL",
  ESTIRENO = "ESTIRENO",
  OLEO_DIESEL = "OLEO_DIESEL",
  OLEO_MINERAL = "OLEO_MINERAL",
}

export enum FreteStatusEnum {
  EM_ANALISE = "EM_ANALISE",
  AGUARDANDO_DECISAO = "AGUARDANDO_DECISAO",
  AGUARDANDO_PAGAMENTO = "AGUARDANDO_PAGAMENTO",
  AGUARDANDO_COLETA = "AGUARDANDO_COLETA",
  EM_ANDAMENTO = "EM_ANDAMENTO",
  FINALIZADO = "FINALIZADO",
  RECUSADO = "RECUSADO",
}
