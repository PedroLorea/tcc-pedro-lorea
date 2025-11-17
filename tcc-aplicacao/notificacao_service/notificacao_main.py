# notificacao_service.py
import asyncio
import json
import signal
import sys
import threading
import time
from typing import Dict, List
from urllib.parse import urlparse, parse_qs

import jwt
import websockets
from pika import BlockingConnection, ConnectionParameters

# === CONFIGURAÇÕES ===
JWT_SECRET = "SuperSecretKeySuperSecretKeySuperSecretKeyx3"
ALGORITHM = "HS256"
WS_HOST = "0.0.0.0"
WS_PORT = 8004
RABBITMQ_HOST = "localhost"

# === ESTADO GLOBAL ===
connected_clients: Dict[str, List[websockets.WebSocketServerProtocol]] = {}
main_loop = None  # Loop principal do asyncio

# === VALIDAÇÃO JWT ===
# def validar_token(token: str, user_id: str) -> bool:
#     try:
#         payload = jwt.decode(token, JWT_SECRET, algorithms=[ALGORITHM])
#         return payload.get("sub") == user_id
#     except Exception:
#         return False

# === HANDLER WEBSOCKET ===
async def handler(websocket):
    from urllib.parse import urlparse, parse_qs

    path = websocket.request.path  # novo jeito no websockets 12+
    query = parse_qs(urlparse(path).query)
    token = query.get("token", [None])[0]
    # user_id = query.get("user_id", [None])[0]

    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[ALGORITHM])
        user_id = str(payload.get("user_id"))

        if not user_id:
            await websocket.close(code=1008, reason="Token sem user_id")
            return

    except jwt.ExpiredSignatureError:
        await websocket.close(code=4001, reason="Token expirado")
        return
    except jwt.InvalidTokenError:
        await websocket.close(code=4002, reason="Token inválido")
        return


    print("user_id: ", user_id)
    print("token: ", token)
    # if not token or not user_id or not validar_token(token, user_id):
    if not token or not user_id:
        await websocket.close(code=1008, reason="Token inválido")
        return

    connected_clients.setdefault(user_id, []).append(websocket)
    print(f"[Connected] User {user_id}")

    try:
        async for _ in websocket:
            pass
    except Exception:
        pass
    finally:
        if user_id in connected_clients and websocket in connected_clients[user_id]:
            connected_clients[user_id].remove(websocket)
            if not connected_clients[user_id]:
                del connected_clients[user_id]
        print(f"[Disconnected] User {user_id}")



# === WEBSOCKET SERVER ===
async def start_websocket_server():
    print(f"[WebSocket] Rodando em {WS_HOST}:{WS_PORT}")
    async with websockets.serve(handler, WS_HOST, WS_PORT):
        await asyncio.Future()  # roda para sempre

# === CONSUMIDOR RABBITMQ ===
def callback(ch, method, properties, body):
    try:
        msg = json.loads(body)
        print("msg: ", msg)

        user_id = str(msg.get("user_id"))
        if not user_id:
            print("[Warn] Mensagem sem user_id, ignorada")
            return

        conexoes = connected_clients.get(user_id, [])
        print("connected_clients: ", connected_clients)

        if not conexoes:
            print(f"[Info] User {user_id} não conectado")
            return

        # Cria payload genérico
        payload = {
            "timestamp": time.time(),
            "source": method.routing_key,
            "data": msg,  # repassa exatamente o corpo recebido
        }

        for ws in conexoes[:]:
            asyncio.run_coroutine_threadsafe(ws.send(json.dumps(payload)), main_loop)
            print(f"[Sent] Notificação enviada a {user_id}")

    except Exception as e:
        print(f"[Error] Erro no consumer: {e}")


def start_rabbitmq_consumer():
    def run():
        print("[RabbitMQ] Conectando...")
        connection = BlockingConnection(ConnectionParameters(RABBITMQ_HOST))
        channel = connection.channel()

        # 🧩 Garante que exchange e fila existam e estejam conectadas
        channel.exchange_declare(exchange="notificacoes", exchange_type="topic", durable=True)
        channel.queue_declare(queue="notificacoes", durable=True)
        channel.queue_bind(
            exchange="notificacoes",
            queue="notificacoes",
            routing_key="notifica.plataforma"
        )

        channel.basic_consume(queue="notificacoes", on_message_callback=callback, auto_ack=True)
        print("[RabbitMQ] Consumindo mensagens...")
        channel.start_consuming()

    thread = threading.Thread(target=run, daemon=True)
    thread.start()


# === MAIN ===
def main():
    global main_loop
    print("=== NOTIFICAÇÃO SERVICE MVP ===")

    # Inicia RabbitMQ em thread separada
    start_rabbitmq_consumer()

    # Captura sinais de encerramento
    def shutdown(*_):
        print("\nEncerrando serviço...")
        sys.exit(0)

    signal.signal(signal.SIGINT, shutdown)
    signal.signal(signal.SIGTERM, shutdown)

    # Inicia WebSocket server
    main_loop = asyncio.get_event_loop()
    main_loop.run_until_complete(start_websocket_server())

if __name__ == "__main__":
    main()
