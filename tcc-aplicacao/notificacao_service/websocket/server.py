# websocket/server.py (versão alterada para usar JWT no handshake)
import asyncio
import websockets
import jwt  # Instale com pip install pyjwt se necessário
from urllib.parse import parse_qs

SECRET_KEY = "sua-chave-secreta-do-auth-service"  # Substitua pela chave real compartilhada

connected_clients = {}  # {user_id: [websocket1, websocket2, ...]} para múltiplas conexões

async def register_client(websocket, path):
    # Extrai JWT da query param (ex: ws://.../ws?token=JWT)
    query = parse_qs(path[2:])  # Ignora o '?' inicial
    token = query.get('token', [None])[0]
    
    if not token:
        print("[⚠️] Conexão sem token. Rejeitando...")
        await websocket.close()
        return
    
    try:
        # Valida JWT e extrai userId
        decoded = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])  # Ajuste o algoritmo se necessário
        user_id = decoded.get('user_id')  # Assuma que o claim é 'userId'; ajuste se for diferente
        
        if not user_id:
            print("[⚠️] JWT sem userId válido.")
            await websocket.close()
            return
        
        # Adiciona a conexão à lista do userId
        if user_id not in connected_clients:
            connected_clients[user_id] = []
        connected_clients[user_id].append(websocket)
        print(f"[🔗] Usuário {user_id} conectado via WebSocket")
        
        try:
            # Mantém a conexão aberta (escuta mensagens opcionais do client)
            async for message in websocket:
                print(f"[📥] Mensagem recebida de {user_id}: {message}")
        except websockets.ConnectionClosed:
            pass
        finally:
            # Remove na desconexão
            connected_clients[user_id].remove(websocket)
            if not connected_clients[user_id]:
                del connected_clients[user_id]
            print(f"[❌] Usuário {user_id} desconectado")
    
    except jwt.InvalidTokenError as e:
        print(f"[❌] JWT inválido: {e}")
        await websocket.close()
    except Exception as e:
        print(f"[❌] Erro na conexão: {e}")
        await websocket.close()

async def start_websocket_server():
    print("[🌐] Servidor WebSocket ouvindo em ws://0.0.0.0:8004/ws/")
    async with websockets.serve(register_client, "0.0.0.0", 8004, ping_interval=None):
        await asyncio.Future()  # Mantém rodando