"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { sendJsonMessage } from "@/utils/sendJsonMessage";
import {
  FRETE_SERVICE_API,
  FRETE_STATUS_AGUARDANDO_COLETA,
  FRETE_STATUS_AGUARDANDO_DECISAO,
  FRETE_STATUS_AGUARDANDO_PAGAMENTO,
  FRETE_STATUS_EM_ANALISE,
  FRETE_STATUS_EM_ANDAMENTO,
  FRETE_STATUS_FINALIZADO,
  FRETE_STATUS_LABELS,
  PAGAMENTO_SERVICE_API,
  TIPOS_PRODUTOS,
} from "@/constants";
import Modal from "@/components/Modal";
import FormInputField from "@/components/FormInputField";
import { FreteDecisaoDTO, FreteDTO, LocalizacaoDTO, TiposProdutosEnum } from "@/types";

const prioridadeStatus: Record<string, number> = {
  EM_ANALISE: 1,
  ORCAMENTO_GERADO: 2,
  AGUARDANDO_PAGAMENTO: 3,
  CONCLUIDO: 4,
};

export default function Dashboard() {
  const [modalTipo, setModalTipo] = useState<null | "solicitar" | "orcamento" | "decisao" | "pagamento" | "confirmarColeta" | "confirmarEntrega" | "motorista" | "caminhao">(null);
  const [freteSelecionado, setFreteSelecionado] = useState<any>(null);
  const [codigoColeta, setCodigoColeta] = useState("");

  const abrirModal = async (tipo: typeof modalTipo, frete?: any) => {
    setModalTipo(tipo);
    if (frete) setFreteSelecionado(frete);

    // Caso seja o modal de pagamento, buscar os detalhes
    if (tipo === "pagamento" && frete) {
      try {
        const detalhes = await sendJsonMessage(
          "GET",
          PAGAMENTO_SERVICE_API.DETALHES_PAGAMENTO,
          frete.uuid
        );

        if (detalhes?.uuid) {
          setPagamentoUuid(detalhes.uuid);
          console.log("🧾 Pagamento UUID obtido:", detalhes.uuid);
        } else {
          console.warn("⚠️ Nenhum pagamento encontrado para este frete.");
        }
      } catch (error) {
        console.error("❌ Erro ao buscar detalhes do pagamento:", error);
        alert("Erro ao buscar detalhes do pagamento.");
      }
    }
  };

  const fecharModal = () => {
    setModalTipo(null);
    setFreteSelecionado(null);
    setPagamentoUuid(null);
  };

  const [fretesAtivos, setFretesAtivos] = useState<FreteDTO[]>([]);
  const [todosFretes, setTodosFretes] = useState<FreteDTO[]>([]);

  useEffect(() => {
    async function fetchFretes() {
      try {
        const fretes = await sendJsonMessage("GET", FRETE_SERVICE_API.LISTAR_FRETES);
        const ativos = fretes.filter((f: FreteDTO) => f.status !== FRETE_STATUS_FINALIZADO);
        setFretesAtivos(ativos);
        setTodosFretes(fretes);
      } catch (err) {
        console.error(err);
      }
    }

    fetchFretes();
  }, []);





  // --- SOLICITAÇÃO DE FRETE ---
  const [coleta, setColeta] = useState<LocalizacaoDTO>({
    cep: "12345-678",
    cidade: "São Paulo",
    estado: "SP",
    rua: "Rua Exemplo",
    numero: 100,
    complemento: "Bloco A",
  });

  const [entrega, setEntrega] = useState<LocalizacaoDTO>({
    cep: "87654-321",
    cidade: "Rio de Janeiro",
    estado: "RJ",
    rua: "Avenida Teste",
    numero: 200,
    complemento: "",
  });

  const [tipoProduto, setTipoProduto] = useState<TiposProdutosEnum>(TiposProdutosEnum.CHILENO);
  const [quantidade, setQuantidade] = useState("10");
  const [dataColeta, setDataColeta] = useState("2025-09-28T14:00:00Z");
  const [dataEntrega, setDataEntrega] = useState("2025-09-29T18:00:00Z");


  async function onSubmitSolicitarFrete() {
    try {
      const novoFrete: FreteDTO = {
        tipo_produto: tipoProduto,
        quantidade: Number(quantidade),
        localizacao_coleta: coleta,
        localizacao_entrega: entrega,
        data_coleta: dataColeta,
        data_entrega: dataEntrega,
      };

      await sendJsonMessage("POST", FRETE_SERVICE_API.SOLICITAR_FRETE, "", novoFrete);
      alert("✅ Frete solicitado com sucesso!");
      fecharModal();

      const fretes = await sendJsonMessage("GET", FRETE_SERVICE_API.LISTAR_FRETES);
      setTodosFretes(fretes);
      setFretesAtivos(fretes.filter((f: FreteDTO) => f.status !== FRETE_STATUS_FINALIZADO));

    } catch (error: any) {
      console.error(error);

      if (error.status === 409) {
        alert(error.data?.detail || "⚠️ Nenhuma unidade operacional disponível.");
        return;
      }

      alert("❌ Erro ao solicitar frete. Tente novamente.");
    }
  }



  // SET ORÇAMENTO FRETE
  const [preco, setPreco] = useState("");

  async function onSubmitGerarOrcamento() {
    if (!freteSelecionado) {
      alert("❌ Nenhum frete selecionado.");
      return;
    }

    try {
      const orcamento = { preco: Number(preco) };

      await sendJsonMessage(
        "PUT",
        FRETE_SERVICE_API.ORCAMENTO_FRETE,
        freteSelecionado.uuid,
        orcamento
      );

      alert("✅ Orçamento gerado com sucesso!");
      fecharModal();

      const fretes = await sendJsonMessage("GET", FRETE_SERVICE_API.LISTAR_FRETES);
      setTodosFretes(fretes);
      setFretesAtivos(fretes.filter((f: FreteDTO) => f.status !== FRETE_STATUS_FINALIZADO));
    } catch (error) {
      console.error(error);
      alert("❌ Erro ao gerar orçamento. Tente novamente.");
    }
  }


  // DECISÃO FRETE

  async function onSubmitDecisaoFrete(decisao: boolean) {
    if (!freteSelecionado) {
      alert("❌ Nenhum frete selecionado.");
      return;
    }

    try {
      const payload: FreteDecisaoDTO = { decisao };

      await sendJsonMessage(
        "PUT",
        FRETE_SERVICE_API.DECISAO_FRETE,
        freteSelecionado.uuid,
        payload
      );

      alert(`✅ Frete ${decisao ? "aceito" : "recusado"} com sucesso!`);
      fecharModal();

      // Recarregar lista de fretes
      const fretes = await sendJsonMessage("GET", FRETE_SERVICE_API.LISTAR_FRETES);
      setTodosFretes(fretes);
      setFretesAtivos(fretes.filter((f: FreteDTO) => f.status !== FRETE_STATUS_FINALIZADO));
    } catch (error) {
      console.error(error);
      alert("❌ Erro ao enviar decisão. Tente novamente.");
    }
  }


  // --- PAGAMENTO DE FRETE ---
  const [pagamentoUuid, setPagamentoUuid] = useState<string | null>(null);


  async function onSubmitPagamento() {
    if (!pagamentoUuid) {
      alert("❌ Nenhum pagamento encontrado para este frete.");
      return;
    }

    try {
      await sendJsonMessage(
        "POST",
        PAGAMENTO_SERVICE_API.PAGAR_PAGAMENTO,
        pagamentoUuid
      );

      alert("✅ Pagamento realizado com sucesso!");
      fecharModal();

      const fretes = await sendJsonMessage("GET", FRETE_SERVICE_API.LISTAR_FRETES);
      setTodosFretes(fretes);
      setFretesAtivos(fretes.filter((f: FreteDTO) => f.status !== FRETE_STATUS_FINALIZADO));
    } catch (error) {
      console.error(error);
      alert("❌ Erro ao realizar pagamento. Tente novamente.");
    }
  }


  // COLETA E ENTREGA
  async function atualizarStatusFrete(novoStatus: string, codigo?: string) {
    if (!freteSelecionado) {
      alert("❌ Nenhum frete selecionado.");
      return;
    }

    try {
      await sendJsonMessage(
        "PUT",
        FRETE_SERVICE_API.ALTERA_STATUS,
        freteSelecionado.uuid,
        { status: novoStatus, codigo: codigo }
      );

      alert("✅ Status atualizado com sucesso!");
      fecharModal();

      const fretes = await sendJsonMessage("GET", FRETE_SERVICE_API.LISTAR_FRETES);
      setTodosFretes(fretes);
      setFretesAtivos(fretes.filter((f: FreteDTO) => f.status !== FRETE_STATUS_FINALIZADO));
    } catch (error) {
      console.error(error);
      alert("❌ Erro ao atualizar status. Tente novamente.");
    }
  }


  // === CRIAR MOTORISTA ===
  const [motorista, setMotorista] = useState({
    email: "joao.silva@example.com",
    cpf: "123.456.789-00",
    nome: "João Silva",
    telefone: "(11) 98765-4321",
    cnh: "AB1234567",
    data_ultima_viagem: "2025-11-01T12:00:00",
    status: "DISPONIVEL",
  });

  async function onSubmitMotorista() {
    try {
      await sendJsonMessage("POST", FRETE_SERVICE_API.CRIAR_MOTORISTA, "", motorista);
      alert("✅ Motorista criado com sucesso!");
      fecharModal();
    } catch (error) {
      console.error(error);
      alert("❌ Erro ao criar motorista. Tente novamente.");
    }
  }

  // === CRIAR CAMINHÃO ===
  const [caminhao, setCaminhao] = useState({
    placa: "ABC-1234",
    marca: "Volvo",
    modelo: "FH 500",
    ano_fabricacao: "2020-05-10T00:00:00",
    peso: 8000,
    altura: 4.0,
    capacidade: 20000.0,
    material_reservatorio: "Aço",
    data_ultima_viagem: "",
    status: "DISPONIVEL",
  });


  async function onSubmitCaminhao() {
    try {
      await sendJsonMessage("POST", FRETE_SERVICE_API.CRIAR_CAMINHAO, "", caminhao);
      alert("✅ Caminhão criado com sucesso!");
      fecharModal();
    } catch (error) {
      console.error(error);
      alert("❌ Erro ao criar caminhão. Tente novamente.");
    }
  }








  const todosFretesOrdenados = [...todosFretes].sort(
    (a, b) => prioridadeStatus[a.status] - prioridadeStatus[b.status]
  );

  return (
    <div className="min-h-[calc(100vh-80px)] bg-roglio-white text-black p-10 space-y-16">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-roglio-blue">Dashboard de Fretes</h1>
        <div className="flex gap-3">
          <button
            onClick={() => abrirModal("solicitar")}
            className="bg-roglio-red hover:bg-red-700 text-white px-5 py-2 rounded-lg transition flex gap-2 cursor-pointer"
          >
            <Plus />
            Solicitar Frete
          </button>

          <button
            onClick={() => abrirModal("motorista")}
            className="bg-roglio-blue hover:bg-blue-800 text-white px-5 py-2 rounded-lg transition flex gap-2 cursor-pointer"
          >
            <Plus />
            Motorista
          </button>

          <button
            onClick={() => abrirModal("caminhao")}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-5 py-2 rounded-lg transition flex gap-2 cursor-pointer"
          >
            <Plus />
            Caminhão
          </button>
        </div>
      </div>


      {/* Fretes Ativos */}
      <section>
        <h2 className="text-2xl font-semibold mb-4 text-roglio-red">Fretes Ativos</h2>

        {fretesAtivos.length === 0 ? (
          <p className="text-gray-500 text-center py-10">Não há fretes ativos no momento.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {fretesAtivos.map((frete) => (
              <div
                key={frete.uuid}
                className="bg-white rounded-2xl shadow-lg border border-gray-200 p-5 flex flex-col justify-between"
              >
                <div>
                  <p className="font-bold text-lg text-roglio-blue mb-2">
                    {frete.localizacao_coleta?.cidade} → {frete.localizacao_entrega?.cidade}
                  </p>
                  <p className="text-gray-600 mb-4">
                    <span className="font-semibold">Status:</span>{" "}
                    {FRETE_STATUS_LABELS[frete.status]}
                  </p>
                </div>

                {frete.status === FRETE_STATUS_AGUARDANDO_DECISAO && (
                  <button
                    onClick={() => abrirModal("decisao", frete)}
                    className="bg-roglio-red hover:bg-red-700 text-white py-2 rounded-lg transition cursor-pointer"
                  >
                    Aceitar ou Recusar Frete
                  </button>
                )}

                {frete.status === FRETE_STATUS_EM_ANALISE && (
                  <button
                    onClick={() => abrirModal("orcamento", frete)}
                    className="bg-roglio-blue hover:bg-blue-800 text-white py-2 rounded-lg transition cursor-pointer"
                  >
                    Gerar Orçamento
                  </button>
                )}

                {frete.status === FRETE_STATUS_AGUARDANDO_PAGAMENTO && (
                  <button
                    onClick={() => abrirModal("pagamento", frete)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded-lg transition cursor-pointer"
                  >
                    Pagar
                  </button>
                )}
                {frete.status === FRETE_STATUS_AGUARDANDO_COLETA && (
                  <button
                    onClick={() => abrirModal("confirmarColeta", frete)}
                    className="bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg transition cursor-pointer"
                  >
                    Confirmar Coleta
                  </button>
                )}

                {frete.status === FRETE_STATUS_EM_ANDAMENTO && (
                  <button
                    onClick={() => abrirModal("confirmarEntrega", frete)}
                    className="bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg transition cursor-pointer"
                  >
                    Confirmar Entrega
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </section>


      {/* Todos os Fretes */}
      <section>
        <h2 className="text-2xl font-semibold mb-4 text-roglio-blue">Todos os Fretes</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 bg-white rounded-2xl overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left px-6 py-3">Coleta</th>
                <th className="text-left px-6 py-3">Entrega</th>
                <th className="text-left px-6 py-3">Status</th>
                <th className="text-center px-6 py-3">Ações</th>
              </tr>
            </thead>
            <tbody>
              {todosFretesOrdenados.map((frete) => (
                <tr key={frete.uuid} className="border-t border-gray-200">
                  <td className="px-6 py-4">{frete.localizacao_coleta?.cidade}</td>
                  <td className="px-6 py-4">{frete.localizacao_entrega?.cidade}</td>
                  <td className="px-6 py-4">{FRETE_STATUS_LABELS[frete.status]}</td>
                  <td className="text-center px-6 py-4">
                    <button
                      onClick={() => (window.location.href = `/frete/${frete.uuid}`)}
                      className="bg-roglio-blue hover:bg-blue-800 text-white px-4 py-2 rounded-lg transition cursor-pointer"
                    >
                      Detalhes
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>


      {/* Modal Solicitar Frete */}
      <Modal isOpen={modalTipo === "solicitar"} onClose={fecharModal} title="Solicitar Frete">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmitSolicitarFrete();
          }}
          className="space-y-6 px-2"
        >
          <h3 className="text-lg font-semibold text-roglio-blue">Dados da Carga</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInputField
              label="Tipo de Produto"
              type="select"
              value={tipoProduto}
              onChange={(e) => setTipoProduto(e.target.value)}
              options={TIPOS_PRODUTOS.map((p) => ({ value: p.id, label: p.label }))}
            />
            <FormInputField
              label="Quantidade"
              type="number"
              placeholder="Ex: 500"
              value={quantidade}
              onChange={(e) => setQuantidade(e.target.value)}
            />
          </div>

          <h3 className="text-lg font-semibold text-roglio-blue">Local de Coleta</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.keys(coleta).map((campo) => (
              <FormInputField
                key={campo}
                label={campo.charAt(0).toUpperCase() + campo.slice(1)}
                value={(coleta as any)[campo]}
                onChange={(e) => setColeta({ ...coleta, [campo]: e.target.value })}
              />
            ))}
          </div>

          <h3 className="text-lg font-semibold text-roglio-blue">Local de Entrega</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.keys(entrega).map((campo) => (
              <FormInputField
                key={campo}
                label={campo.charAt(0).toUpperCase() + campo.slice(1)}
                value={(entrega as any)[campo]}
                onChange={(e) => setEntrega({ ...entrega, [campo]: e.target.value })}
              />
            ))}
          </div>

          <h3 className="text-lg font-semibold text-roglio-blue">Datas</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInputField
              label="Data de Coleta"
              type="date"
              value={dataColeta}
              onChange={(e) => setDataColeta(e.target.value)}
            />
            <FormInputField
              label="Data de Entrega"
              type="date"
              value={dataEntrega}
              onChange={(e) => setDataEntrega(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-roglio-blue text-white py-2 rounded-lg hover:bg-blue-800 transition"
          >
            Solicitar Frete
          </button>
        </form>
      </Modal>

      {/* Modal Gerar Orçamento */}
      <Modal isOpen={modalTipo === "orcamento"} onClose={fecharModal} title="Gerar Orçamento">
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            await onSubmitGerarOrcamento();
          }}
          className="space-y-4"
        >
          <FormInputField
            label="Valor do Orçamento (R$)"
            type="number"
            placeholder="Ex: 1500.00"
            value={preco}
            onChange={(e) => setPreco(e.target.value)}
          />

          <button
            type="submit"
            className="w-full mt-2 bg-roglio-blue text-white py-2 rounded-lg hover:bg-blue-800 transition"
          >
            Confirmar
          </button>
        </form>
      </Modal>

      {/* Modal Decidir Frete */}
      <Modal isOpen={modalTipo === "decisao"} onClose={fecharModal} title="Decisão de Frete">
        <p className="text-gray-700 mb-4">
          Deseja <strong>aceitar</strong> ou <strong>recusar</strong> este frete?
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={() => onSubmitDecisaoFrete(true)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Aceitar
          </button>
          <button
            onClick={() => onSubmitDecisaoFrete(false)}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Recusar
          </button>
        </div>
      </Modal>

      {/* Modal Pagamento */}
      <Modal isOpen={modalTipo === "pagamento"} onClose={fecharModal} title="Pagamento do Frete">
        <div className="space-y-4 flex flex-col items-center">
          <p className="text-gray-700">Escaneie o QR Code abaixo para realizar o pagamento:</p>
          <img
            src="/qrcode.png"
            alt="QR Code de pagamento"
            className="w-48 h-48 rounded-lg object-cover"
          />
          <button
            onClick={onSubmitPagamento}
            className="mt-4 bg-roglio-blue text-white py-2 px-6 rounded-lg hover:bg-blue-800"
          >
            Pagar
          </button>
        </div>
      </Modal>



      {/* Modal Confirmar Coleta */}
<Modal
  isOpen={modalTipo === "confirmarColeta"}
  onClose={fecharModal}
  title="Confirmação de Coleta"
>
  <p className="text-gray-700 mb-4 text-center">
    O pedido foi <strong>coletado</strong>?
  </p>

  {/* Input do código */}
  <input
    type="text"
    value={codigoColeta}
    onChange={(e) => setCodigoColeta(e.target.value)}
    placeholder="Digite o código de coleta"
    className="w-full px-3 py-2 border rounded-lg mb-4"
  />

  <div className="flex justify-center gap-3">
    <button
      onClick={() => atualizarStatusFrete(FRETE_STATUS_EM_ANDAMENTO, codigoColeta)}
      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
    >
      Sim
    </button>

    <button
      onClick={fecharModal}
      className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
    >
      Não
    </button>
  </div>
</Modal>


      {/* Modal Confirmar Entrega */}
      <Modal
        isOpen={modalTipo === "confirmarEntrega"}
        onClose={fecharModal}
        title="Confirmação de Entrega"
      >
        <p className="text-gray-700 mb-4 text-center">
          O pedido foi <strong>entregue</strong>?
        </p>
        <div className="flex justify-center gap-3">
          <button
            onClick={() => atualizarStatusFrete(FRETE_STATUS_FINALIZADO)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Sim
          </button>
          <button
            onClick={fecharModal}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
          >
            Não
          </button>
        </div>
      </Modal>


      {/* Modal Criar Motorista */}
      <Modal isOpen={modalTipo === "motorista"} onClose={fecharModal} title="Cadastrar Motorista">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmitMotorista();
          }}
          className="space-y-4"
        >
          <FormInputField label="Nome" value={motorista.nome} onChange={(e) => setMotorista({ ...motorista, nome: e.target.value })} />
          <FormInputField label="Email" type="email" value={motorista.email} onChange={(e) => setMotorista({ ...motorista, email: e.target.value })} />
          <FormInputField label="CPF" value={motorista.cpf} onChange={(e) => setMotorista({ ...motorista, cpf: e.target.value })} />
          <FormInputField label="Telefone" value={motorista.telefone} onChange={(e) => setMotorista({ ...motorista, telefone: e.target.value })} />
          <FormInputField label="CNH" value={motorista.cnh} onChange={(e) => setMotorista({ ...motorista, cnh: e.target.value })} />
          <FormInputField label="Data Última Viagem" type="date" value={motorista.data_ultima_viagem} onChange={(e) => setMotorista({ ...motorista, data_ultima_viagem: e.target.value })} />

          <button type="submit" className="w-full bg-roglio-blue text-white py-2 rounded-lg hover:bg-blue-800 transition">
            Criar Motorista
          </button>
        </form>
      </Modal>

      {/* Modal Criar Caminhão */}
      <Modal isOpen={modalTipo === "caminhao"} onClose={fecharModal} title="Cadastrar Caminhão">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmitCaminhao();
          }}
          className="space-y-4"
        >
          <FormInputField label="Placa" value={caminhao.placa} onChange={(e) => setCaminhao({ ...caminhao, placa: e.target.value })} />
          <FormInputField label="Marca" value={caminhao.marca} onChange={(e) => setCaminhao({ ...caminhao, marca: e.target.value })} />
          <FormInputField label="Modelo" value={caminhao.modelo} onChange={(e) => setCaminhao({ ...caminhao, modelo: e.target.value })} />
          <FormInputField label="Ano de Fabricação" type="date" value={caminhao.ano_fabricacao} onChange={(e) => setCaminhao({ ...caminhao, ano_fabricacao: e.target.value })} />
          <FormInputField label="Peso (kg)" type="number" value={caminhao.peso} onChange={(e) => setCaminhao({ ...caminhao, peso: e.target.value })} />
          <FormInputField label="Altura (m)" type="number" value={caminhao.altura} onChange={(e) => setCaminhao({ ...caminhao, altura: e.target.value })} />
          <FormInputField label="Capacidade (L)" type="number" value={caminhao.capacidade} onChange={(e) => setCaminhao({ ...caminhao, capacidade: e.target.value })} />
          <FormInputField label="Material do Reservatório" value={caminhao.material_reservatorio} onChange={(e) => setCaminhao({ ...caminhao, material_reservatorio: e.target.value })} />

          <button type="submit" className="w-full bg-roglio-blue text-white py-2 rounded-lg hover:bg-blue-800 transition">
            Criar Caminhão
          </button>
        </form>
      </Modal>




    </div >
  );
}
