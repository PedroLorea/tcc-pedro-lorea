import asyncio
import json
import signal
import sys
import threading
import time
import os
from typing import Dict, List
from urllib.parse import urlparse, parse_qs

import jwt
import websockets
from pika import BlockingConnection, ConnectionParameters

# ========================
# CONFIGURAÇÕES
# ========================
JWT_SECRET = "SuperSecretKeySuperSecretKeySuperSecretKeyx3"
ALGORITHM = "HS256"
WS_HOST = "0.0.0.0"
WS_PORT = 8004

# pega do docker-compose
RABBITMQ_HOST = os.getenv("RABBITMQ_HOST", "rabbitmq")

# ========================
# ESTADO GLOBAL
# ========================
connected_clients: Dict[str, List[websockets.WebSocketServerProtocol]] = {}
main_loop = None


# ========================
# HANDLER WEBSOCKET
# ========================
async def handler(websocket):
    # websockets 12+
    path = websocket.path
    query = parse_qs(urlparse(path).query)

    token = query.get("token", [None])[0]

    if not token:
        await websocket.close(code=1008, reason="Token ausente")
        return

    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[ALGORITHM])
        user_id = str(payload.get("user_id"))
        if not user_id:
            await websocket.close(code=1008, reason="Token sem user_id")
            return
    except Exception:
        await websocket.close(code=1008, reason="Token inválido")
        return

    connected_clients.setdefault(user_id, []).append(websocket)
    print(f"[Connected] user {user_id}")

    try:
        async for _ in websocket:
            pass
    except:
        pass
    finally:
        # remove ao desconectar
        if user_id in connected_clients and websocket in connected_clients[user_id]:
            connected_clients[user_id].remove(websocket)
            if not connected_clients[user_id]:
                del connected_clients[user_id]
        print(f"[Disconnected] user {user_id}")


# ========================
# WEBSOCKET SERVER
# ========================
async def start_websocket_server():
    print(f"[WebSocket] Rodando em {WS_HOST}:{WS_PORT}")
    async with websockets.serve(handler, WS_HOST, WS_PORT):
        await asyncio.Future()


# ========================
# CALLBACK DO RABBITMQ
# ========================
def callback(ch, method, properties, body):
    try:
        msg = json.loads(body)
        user_id = str(msg.get("user_id"))

        if not user_id:
            print("[Warn] Mensagem sem user_id")
            return

        conexoes = connected_clients.get(user_id, [])

        if not conexoes:
            print(f"[Info] user {user_id} não conectado")
            return

        payload = {
            "timestamp": time.time(),
            "source": method.routing_key,
            "data": msg
        }

        for ws in conexoes[:]:
            asyncio.run_coroutine_threadsafe(ws.send(json.dumps(payload)), main_loop)
            print(f"[Sent] notificação enviada -> {user_id}")

    except Exception as e:
        print("[Error] callback:", e)


# ========================
# RABBITMQ CONSUMER
# ========================
def start_rabbitmq_consumer():

    def run():
        print("[RabbitMQ] Conectando em", RABBITMQ_HOST)

        connection = BlockingConnection(
            ConnectionParameters(host=RABBITMQ_HOST)
        )
        channel = connection.channel()

        channel.exchange_declare(exchange="notificacoes", exchange_type="topic", durable=True)
        channel.queue_declare(queue="notificacoes", durable=True)
        channel.queue_bind(exchange="notificacoes", queue="notificacoes", routing_key="notifica.plataforma")

        print("[RabbitMQ] Consumindo...")
        channel.basic_consume(queue="notificacoes", on_message_callback=callback, auto_ack=True)
        channel.start_consuming()

    threading.Thread(target=run, daemon=True).start()


# ========================
# MAIN
# ========================
def main():
    global main_loop
    print("=== NOTIFICATION SERVICE ===")

    # start consumer
    start_rabbitmq_consumer()

    # SIGINT / SIGTERM
    def shutdown(*_):
        print("Encerrando serviço...")
        sys.exit(0)

    signal.signal(signal.SIGINT, shutdown)
    signal.signal(signal.SIGTERM, shutdown)

    # asyncio loop moderno
    main_loop = asyncio.new_event_loop()
    asyncio.set_event_loop(main_loop)

    main_loop.run_until_complete(start_websocket_server())


if __name__ == "__main__":
    main()
