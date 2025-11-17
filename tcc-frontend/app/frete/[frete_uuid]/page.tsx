"use client";


import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import dynamic from "next/dynamic";
import { sendJsonMessage } from "@/utils/sendJsonMessage";
import { FRETE_SERVICE_API } from "@/constants";
import { FreteDTO } from "@/types";
import { formatDate } from "@/utils/dateFormat";

const FreteRastreamento = dynamic(() => import("@/components/FreteRastreamento"), { ssr: false });

export default function FreteDetalhes() {
  const { frete_uuid } = useParams() as { frete_uuid: string };
  const [rastreando, setRastreando] = useState(false);
  const [posicoes, setPosicoes] = useState<{ label: string; coords: [number, number]; timestamp: string }[]>([]);
  const [frete, setFrete] = useState<FreteDTO>();

  useEffect(() => {
    async function fetchFretes() {
      try {
        const frete = await sendJsonMessage("GET", FRETE_SERVICE_API.DETALHES_FRETE, frete_uuid);

        setFrete(frete);
      } catch (err) {
        console.error(err);
      }
    }

    fetchFretes();
  }, []);

  // Simulando dados do frete
  // const frete = {
  //   id: frete_uuid,
  //   motorista: "João da Silva",
  //   caminhao: "Volvo FH 540 - ABC-1234",
  //   cliente: "Madeiras Sul Ltda.",
  //   coleta: "Porto Alegre - RS",
  //   destino: "Curitiba - PR",
  //   tipoProduto: "Pallets de madeira",
  //   status: "Em andamento",
  //   dataColeta: "2025-11-05",
  //   dataEntrega: "2025-11-09",
  //   quantidade: "120 unidades",
  // };

  const handleRastrear = async () => {
    try {
      setRastreando(true);

      const resposta = await sendJsonMessage(
        "GET",
        "http://127.0.0.1:8005/rastreamento/detalhes/",
        frete_uuid
      );

      if (!resposta?.Coordenadas) {
        alert("🚫 Nenhum rastreamento ativo para este frete.");
        setRastreando(false);
        return;
      }

      const coord = resposta.Coordenadas;

      const novaPosicao = {
        label: "Posição atual",
        coords: [coord.latitude, coord.longitude] as [number, number],
        timestamp: coord.timestamp,
      };

      setPosicoes((prev) => [...prev, novaPosicao]);

    } catch (err) {
      console.error("Erro ao rastrear:", err);
      alert("Erro ao obter rastreamento.");
    }
  };


  if (!frete) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center text-gray-500">
        Carregando detalhes do frete...
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-80px)] bg-roglio-white text-black p-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-roglio-blue">Detalhes do Frete</h1>
        <p className="text-gray-600 mt-1">
          Visualizando informações do frete <span className="font-mono">{frete_uuid}</span>
        </p>
      </div>

      <div className="bg-white shadow-lg rounded-2xl border border-gray-200 p-8 space-y-6 max-w-4xl mx-auto">
        <div className="grid md:grid-cols-2 gap-6">
          <Info label="Motorista" value={frete?.motorista?.email} />
          <Info label="Caminhão" value={frete?.caminhao?.placa} />
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <Info label="Cliente" value={frete?.cliente?.nome_empresa} />
          <Info label="Tipo de Produto" value={frete?.tipo_produto} />
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <Info label="Local de Coleta" value={frete?.localizacao_coleta?.cidade} />
          <Info label="Local de Entrega" value={frete?.localizacao_entrega?.cidade} />
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          <Info label="Status" value={frete?.status} />
          <Info label="Data de Coleta" value={formatDate(frete?.data_coleta)} />
          <Info label="Data de Entrega" value={formatDate(frete?.data_entrega)} />
        </div>
        <div><Info label="Quantidade" value={String(frete?.quantidade)} /></div>

        <div className="pt-4 flex gap-3">
          <button
            onClick={() => window.history.back()}
            className="bg-roglio-blue hover:bg-blue-800 text-white px-6 py-2 rounded-lg transition cursor-pointer"
          >
            ← Voltar
          </button>

          <button
            onClick={handleRastrear}
            className="bg-roglio-red hover:bg-red-700 text-white px-6 py-2 rounded-lg transition cursor-pointer"
          >
            Rastrear
          </button>
        </div>

        {rastreando && (
          <FreteRastreamento posicoes={posicoes} />
        )}
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-lg font-semibold text-roglio-blue">{value}</span>
    </div>
  );
}
