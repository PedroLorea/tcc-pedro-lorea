export enum AUTH_ROUTES {
  LOGIN_PAGE = "/login/",
  CADASTRAR_PAGE = "/cadastrar/"
}

export enum WEBSITE_ROUTES {
  PAGINA_INICIAL_PAGE = "/",
  DASHBOARD_PAGE = "/dashboard/",
  SUPORTE_PAGE = "/suporte/",
  NOTIFICACOES_PAGE = "/notificacoes/"
}

export const FRETE_SERVICE_API = {
  LISTAR_FRETES: process.env.NEXT_PUBLIC_FRETE_SERVICE_URL + "/fretes/listar/",
  DETALHES_FRETE: process.env.NEXT_PUBLIC_FRETE_SERVICE_URL + "/fretes/detalhes/",
  SOLICITAR_FRETE: process.env.NEXT_PUBLIC_FRETE_SERVICE_URL + "/fretes/solicitar/",
  ORCAMENTO_FRETE: process.env.NEXT_PUBLIC_FRETE_SERVICE_URL + "/fretes/orcamento/",
  DECISAO_FRETE: process.env.NEXT_PUBLIC_FRETE_SERVICE_URL + "/fretes/decisao/",
  ALTERA_STATUS: process.env.NEXT_PUBLIC_FRETE_SERVICE_URL + "/fretes/altera-status/",
  CRIAR_MOTORISTA: process.env.NEXT_PUBLIC_FRETE_SERVICE_URL + "/motorista/criar/",
  CRIAR_CAMINHAO: process.env.NEXT_PUBLIC_FRETE_SERVICE_URL + "/caminhao/criar/",
};

export const PAGAMENTO_SERVICE_API = {
  PAGAR_PAGAMENTO: process.env.NEXT_PUBLIC_PAGAMENTO_SERVICE_URL + "/pagamentos/pagar/",
  DETALHES_PAGAMENTO: process.env.NEXT_PUBLIC_PAGAMENTO_SERVICE_URL + "/pagamentos/detalhes/"
}

export const AUTENTICACAO_SERVICE_API = {
  REGISTRAR: process.env.NEXT_PUBLIC_AUTENTICACAO_SERVICE_URL + "/autenticacao/registrar/",
  LOGIN: process.env.NEXT_PUBLIC_AUTENTICACAO_SERVICE_URL + "/autenticacao/entrar/",
}


// TIPOS DE PRODUTOS
export const TIPO_PRODUTO_CHILENO = "CHILENO";
export const TIPO_PRODUTO_TOLUENO = "TOLUENO";
export const TIPO_PRODUTO_HEXANO = "HEXANO";
export const TIPO_PRODUTO_BENZENO = "BENZENO";
export const TIPO_PRODUTO_SOLVENTE_C6 = "SOLVENTE_C6";
export const TIPO_PRODUTO_AGUARRAS = "AGUARRAS";
export const TIPO_PRODUTO_GASOLINA = "GASOLINA";
export const TIPO_PRODUTO_METANOL = "METANOL";
export const TIPO_PRODUTO_ETANOL = "ETANOL";
export const TIPO_PRODUTO_GLICERINA = "GLICERINA";
export const TIPO_PRODUTO_BIODIESEL = "BIODIESEL";
export const TIPO_PRODUTO_ESTIRENO = "ESTIRENO";
export const TIPO_PRODUTO_OLEO_DIESEL = "OLEO_DIESEL";
export const TIPO_PRODUTO_OLEO_MINERAL = "OLEO_MINERAL";

export const TIPOS_PRODUTOS: { id: string; label: string }[] = [
  { id: TIPO_PRODUTO_CHILENO, label: "Chileno" },
  { id: TIPO_PRODUTO_TOLUENO, label: "Tolueno" },
  { id: TIPO_PRODUTO_HEXANO, label: "Hexano" },
  { id: TIPO_PRODUTO_BENZENO, label: "Benzeno" },
  { id: TIPO_PRODUTO_SOLVENTE_C6, label: "Solvente C6" },
  { id: TIPO_PRODUTO_AGUARRAS, label: "Aguarrás" },
  { id: TIPO_PRODUTO_GASOLINA, label: "Gasolina" },
  { id: TIPO_PRODUTO_METANOL, label: "Metanol" },
  { id: TIPO_PRODUTO_ETANOL, label: "Etanol" },
  { id: TIPO_PRODUTO_GLICERINA, label: "Glicerina" },
  { id: TIPO_PRODUTO_BIODIESEL, label: "Biodiesel" },
  { id: TIPO_PRODUTO_ESTIRENO, label: "Estireno" },
  { id: TIPO_PRODUTO_OLEO_DIESEL, label: "Óleo Diesel" },
  { id: TIPO_PRODUTO_OLEO_MINERAL, label: "Óleo Mineral" },
];

// STATUS DE FRETE
export const FRETE_STATUS_EM_ANALISE = "EM_ANALISE";
export const FRETE_STATUS_AGUARDANDO_DECISAO = "AGUARDANDO_DECISAO";
export const FRETE_STATUS_AGUARDANDO_PAGAMENTO = "AGUARDANDO_PAGAMENTO";
export const FRETE_STATUS_AGUARDANDO_COLETA = "AGUARDANDO_COLETA";
export const FRETE_STATUS_EM_ANDAMENTO = "EM_ANDAMENTO";
export const FRETE_STATUS_FINALIZADO = "FINALIZADO";
export const FRETE_STATUS_RECUSADO = "RECUSADO";

export const FRETE_STATUS_LABELS: Record<string, string> = {
  [FRETE_STATUS_EM_ANALISE]: "Em Análise",
  [FRETE_STATUS_AGUARDANDO_DECISAO]: "Aguardando Decisão",
  [FRETE_STATUS_AGUARDANDO_PAGAMENTO]: "Aguardando Pagamento",
  [FRETE_STATUS_AGUARDANDO_COLETA]: "Aguardando Coleta",
  [FRETE_STATUS_EM_ANDAMENTO]: "Em Andamento",
  [FRETE_STATUS_FINALIZADO]: "Finalizado",
  [FRETE_STATUS_RECUSADO]: "Recusado",
};


// STATUS DE UNIDADE OPERACIONAL
export const UNIDADE_OPERACIONAL_STATUS_DISPONIVEL = "DISPONIVEL";
export const UNIDADE_OPERACIONAL_STATUS_RESERVADO = "RESERVADO";
export const UNIDADE_OPERACIONAL_STATUS_EM_TRANSPORTE = "EM_TRANSPORTE";
export const UNIDADE_OPERACIONAL_STATUS_INDISPONIVEL = "INDISPONIVEL";

export const UNIDADE_OPERACIONAL_STATUS: { id: string; label: string }[] = [
  { id: UNIDADE_OPERACIONAL_STATUS_DISPONIVEL, label: "Disponível" },
  { id: UNIDADE_OPERACIONAL_STATUS_RESERVADO, label: "Reservado" },
  { id: UNIDADE_OPERACIONAL_STATUS_EM_TRANSPORTE, label: "Em transporte" },
  { id: UNIDADE_OPERACIONAL_STATUS_INDISPONIVEL, label: "Indisponível" },
];

// RESERVATÓRIOS
export const RESERVATORIO_MATERIAL_ACO = "ACO";
export const RESERVATORIO_MATERIAL_ALUMINIO = "ALUMINIO";

export const RESERVATORIOS_MATERIAIS: { id: string; label: string }[] = [
  { id: RESERVATORIO_MATERIAL_ACO, label: "Aço" },
  { id: RESERVATORIO_MATERIAL_ALUMINIO, label: "Alumínio" },
];
