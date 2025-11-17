"use client";
import { useState, useEffect } from "react";
import { Trash2 } from "lucide-react";
import { useNotificacoes } from "@/utils/NotificacaoContext";

export default function NotificacoesPage() {
  const { notificacoes, marcarComoLida, removerNotificacao } = useNotificacoes();

  
  return (
    <div className="min-h-[calc(100vh-80px)] bg-roglio-white text-black p-10 flex justify-center">
      <div className="w-full max-w-2xl space-y-8">
        <h1 className="text-3xl font-bold text-roglio-blue">Notificações</h1>
        {notificacoes.length === 0 ? (
          <p className="text-gray-500 text-center mt-10">
            Nenhuma notificação no momento.
          </p>
        ) : (
          <ul className="space-y-4">
            {notificacoes.map((notificacao) => (
              <li
                key={notificacao.id}
                onClick={() => marcarComoLida(notificacao.id)}  // Marca como lida ao clicar
                className={`border rounded-2xl p-4 shadow flex justify-between items-start cursor-pointer ${notificacao.read ? "bg-gray-100" : "bg-white"
                  }`}
              >
                <div className="flex flex-col gap-1">
                  <p className="font-semibold text-roglio-blue">{notificacao.title || notificacao.tipo}</p>
                  <p className="text-gray-700">{notificacao.message}</p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();  // Evita marcar como lida ao remover
                    removerNotificacao(notificacao.id);
                  }}
                  className="text-red-600 hover:text-red-800 ml-4"
                >
                  <Trash2 size={18} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}