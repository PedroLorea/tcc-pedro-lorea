"use client";

import { useState, useEffect, useRef } from "react";
import { Send } from "lucide-react";

export default function SuportePage() {
  const [messages, setMessages] = useState<{ role: "user" | "bot"; text: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = { role: "user", text: input } as const;
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8002/suporte/perguntar/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pergunta: input }),
      });

      if (!response.ok) throw new Error("Erro ao conectar com o suporte_service");

      const data = await response.json();
      const botResponse = {
        role: "bot",
        text: data.resposta || "Desculpe, não consegui entender sua pergunta.",
      } as const;

      setMessages((prev) => [...prev, botResponse]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "⚠️ Erro ao conectar com o suporte. Tente novamente mais tarde." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100dvh-80px)] bg-gray-50 overflow-hidden">
      <main className="flex-1 overflow-y-auto p-4 flex justify-center">
        <div className="w-full max-w-2xl space-y-3 pb-24">
          {messages.length === 0 ? (
            <p className="text-gray-500 text-center mt-10">
              Inicie uma conversa com o suporte 👇
            </p>
          ) : (
            messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`rounded-2xl px-4 py-2 max-w-[75%] text-sm shadow ${
                    msg.role === "user"
                      ? "bg-primary/90 text-white rounded-br-none"
                      : "bg-white text-gray-800 rounded-bl-none border"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))
          )}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-white text-gray-800 border rounded-2xl px-4 py-2 shadow text-sm">
                Digitando...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      <footer className="bg-white border-t mt-6 p-4 flex justify-center">
        <div className="w-full max-w-2xl flex items-center gap-2">
          <input
            type="text"
            placeholder="Digite sua mensagem..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            className="flex-1 border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            onClick={handleSend}
            disabled={loading}
            className="bg-primary text-white p-2 rounded-xl hover:bg-primary/90 transition cursor-pointer disabled:opacity-50"
          >
            <Send size={18} />
          </button>
        </div>
      </footer>
    </div>
  );
}
