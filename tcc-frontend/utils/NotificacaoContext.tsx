"use client";

import { createContext, useContext, useEffect, useState, useRef } from "react";

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const [notificacoes, setNotificacoes] = useState([]);
  const [isClient, setIsClient] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);        // ← guarda a conexão
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const retryCountRef = useRef(0);
  const maxRetries = 6; // tenta até ~60 segundos no total

  // Carrega do localStorage
  useEffect(() => {
    setIsClient(true);
    const saved = localStorage.getItem("notificacoes");
    if (saved) setNotificacoes(JSON.parse(saved));
  }, []);

  // Salva no localStorage
  useEffect(() => {
    if (isClient) {
      localStorage.setItem("notificacoes", JSON.stringify(notificacoes));
    }
  }, [notificacoes, isClient]);

  // WebSocket com reconexão automática (NUNCA MAIS RECARREGA A PÁGINA)
  useEffect(() => {
    if (!isClient) return;

    const jwt = localStorage.getItem("jwt");
    if (!jwt) return;

    const connect = () => {
      // Se já tem conexão aberta, não cria outra
      if (wsRef.current?.readyState === WebSocket.OPEN) return;

      const socket = new WebSocket(`ws://localhost:8004?token=${jwt}`);
      wsRef.current = socket;

      socket.onopen = () => {
        console.log("[WebSocket] Conectado com sucesso");
        retryCountRef.current = 0; // reseta tentativas
      };

      socket.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          const payload = msg.data || {};

          const title =
            payload.title ||
            payload.tipo ||
            msg.source?.replace("notifica.", "").toUpperCase() ||
            "Notificação";

          const message =
            payload.message ||
            Object.entries(payload)
              .map(([k, v]) => `${k}: ${v}`)
              .join(" | ");

          const novaNotificacao = {
            id: Date.now() + Math.random(),
            title,
            message,
            raw: msg,
            read: false,
            timestamp: msg.timestamp || Date.now(),
          };

          setNotificacoes((prev) => {
            const atualizadas = [novaNotificacao, ...prev];
            localStorage.setItem("notificacoes", JSON.stringify(atualizadas));
            return atualizadas;
          });
        } catch (err) {
          console.log("Erro ao processar mensagem WebSocket", err);
        }
      };

      socket.onclose = () => {
        console.log("[WebSocket] Desconectado");
        wsRef.current = null;

        if (retryCountRef.current < maxRetries) {
          retryCountRef.current++;
          const delay = Math.min(1000 * 2 ** retryCountRef.current, 10000); // backoff exponencial
          console.log(`Tentando reconectar em ${delay / 1000}s... (${retryCountRef.current}/${maxRetries})`);

          reconnectTimeoutRef.current = setTimeout(connect, delay);
        } else {
          console.log("[WebSocket] Falha permanente – máximo de tentativas atingido");
        }
      };

      socket.onerror = (err) => {
        console.log("[WebSocket] Erro:", err);
        socket.close();
      };
    };

    connect();

    // Cleanup
    return () => {
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
      if (wsRef.current) wsRef.current.close();
    };
  }, [isClient]);

  const marcarComoLida = (id: number) => {
    setNotificacoes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const removerNotificacao = (id: number) => {
    setNotificacoes((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <NotificationContext.Provider value={{ notificacoes, marcarComoLida, removerNotificacao }}>
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotificacoes = () => useContext(NotificationContext);