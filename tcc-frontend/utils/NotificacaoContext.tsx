"use client";
import { createContext, useContext, useEffect, useState } from "react";

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const [notificacoes, setNotificacoes] = useState([]);
  const [isClient, setIsClient] = useState(false);

  // ✅ Garante que só rode no cliente
  useEffect(() => {
    setIsClient(true);

    const saved = localStorage.getItem("notificacoes");
    if (saved) {
      setNotificacoes(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("notificacoes", JSON.stringify(notificacoes));
  }, [notificacoes, isClient]);

  useEffect(() => {
    if (!isClient) return;

    const jwt = localStorage.getItem("jwt");
    if (!jwt) return;

    const socket = new WebSocket(`ws://localhost:8004?token=${jwt}`);

    socket.onopen = () => console.log("[🔗] WebSocket conectado");

    socket.onmessage = (event) => {
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
        id: Date.now(),
        title,
        message,
        raw: msg,
        read: false,
        timestamp: msg.timestamp,
      };

      setNotificacoes((prev) => {
        const atualizadas = [novaNotificacao, ...prev];
        localStorage.setItem("notificacoes", JSON.stringify(atualizadas));
        return atualizadas;
      });
    };

    socket.onclose = () => {
      console.log("[❌] WebSocket desconectado. Tentando reconectar...");
      setTimeout(() => window.location.reload(), 5000);
    };

    return () => socket.close();
  }, [isClient]);

  const marcarComoLida = (id) => {
    setNotificacoes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const removerNotificacao = (id) => {
    const atualizadas = notificacoes.filter((n) => n.id !== id);
    setNotificacoes(atualizadas);
    if (isClient) {
      localStorage.setItem("notificacoes", JSON.stringify(atualizadas));
    }
  };

  return (
    <NotificationContext.Provider
      value={{ notificacoes, marcarComoLida, removerNotificacao }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotificacoes = () => useContext(NotificationContext);
