// src/utils/websocket.ts
let ws: WebSocket | null = null;
let reconnectAttempts = 0;
const maxReconnectAttempts = 5;

export const connectWebSocket = (jwt: string, userId: string) => {
	if (ws?.readyState === WebSocket.OPEN) return;

	const wsUrl = `${process.env.NEXT_PUBLIC_NOTIFICACAO_SERVICE_URL}/ws/notificacoes?token=${jwt}&user_id=${userId}`;
	ws = new WebSocket(wsUrl);

	ws.onopen = () => {
		console.log("WebSocket conectado!");
		reconnectAttempts = 0;
	};

	ws.onmessage = (event) => {
		const data = JSON.parse(event.data);
		console.log("Notificação recebida:", data);
		window.dispatchEvent(new CustomEvent("notificacao", { detail: data }));
	};

	ws.onclose = () => {
		console.log("WebSocket fechado. Tentando reconectar...");
		if (reconnectAttempts < maxReconnectAttempts) {
			setTimeout(() => {
				reconnectAttempts++;
				connectWebSocket(jwt, userId);
			}, 1000 * 2 ** reconnectAttempts);
		}
	};

	ws.onerror = (err) => {
		console.error("Erro no WebSocket:", err);
	};
};

export const closeWebSocket = () => {
	ws?.close();
	ws = null;
};