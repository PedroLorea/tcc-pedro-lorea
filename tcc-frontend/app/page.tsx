"use client";

import { WEBSITE_ROUTES } from "@/constants";
import { Zap, Timer, CheckCircle, MessageSquare, Truck } from "lucide-react";
import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-[calc(100vh-80px)] bg-roglio-white text-gray-900 flex flex-col">

      <section className="relative flex flex-col items-center justify-center text-center py-48 px-6 text-white">
        {/* Imagem otimizada */}
        <Image
          src="/caminhao-tanque.avif"
          alt="Caminhão tanque na estrada"
          fill
          className="object-cover object-center"
          priority
        />

        {/* Overlay escurecido */}
        <div className="absolute inset-0 bg-black/60"></div>

        {/* Conteúdo */}
        <div className="relative z-10 max-w-3xl">
          <h1 className="text-5xl font-extrabold mb-6 drop-shadow-lg">
            Transporte inteligente com a <span className="text-roglio-red">Roglio Transportadora</span>
          </h1>
          <p className="text-lg mb-8 text-gray-100 drop-shadow">
            Soluções rápidas, automatizadas e seguras para suas demandas de transporte — da solicitação à entrega.
          </p>
          <button className="bg-roglio-red hover:bg-red-700 px-8 py-3 rounded-xl font-semibold transition flex items-center gap-2 mx-auto cursor-pointer">
            <a href={WEBSITE_ROUTES.DASHBOARD_PAGE}>
              Solicite o seu frete já
            </a>
          </button>
        </div>
      </section>


      {/* VANTAGENS */}
      <section className="py-32 px-8 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 text-center">
        <div className="flex flex-col items-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition">
          <Zap size={40} className="text-roglio-red mb-3" />
          <h3 className="text-xl font-bold mb-2">Processo automatizado</h3>
          <p className="text-gray-600">
            Todo o fluxo de solicitação, aprovação e acompanhamento ocorre de
            forma automatizada, sem burocracia.
          </p>
        </div>

        <div className="flex flex-col items-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition">
          <Timer size={40} className="text-roglio-red mb-3" />
          <h3 className="text-xl font-bold mb-2">Orçamento em até 2 dias</h3>
          <p className="text-gray-600">
            Receba uma proposta personalizada de transporte em até 48 horas após
            sua solicitação.
          </p>
        </div>

        <div className="flex flex-col items-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition">
          <CheckCircle size={40} className="text-roglio-red mb-3" />
          <h3 className="text-xl font-bold mb-2">Verificação instantânea</h3>
          <p className="text-gray-600">
            Consulte instantaneamente a disponibilidade de caminhões e
            transportadoras.
          </p>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="bg-roglio-blue text-white py-20 text-center">
        <h2 className="text-3xl font-bold mb-6">
          Pronto para acelerar sua logística?
        </h2>
        <button className="bg-roglio-red hover:bg-red-700 px-8 py-3 rounded-xl font-semibold transition flex items-center gap-2 mx-auto cursor-pointer">
          <Truck size={22} />
          <a href={WEBSITE_ROUTES.DASHBOARD_PAGE}>
            Solicite o seu frete já
          </a>
        </button>
      </section>
    </main>
  );
}
