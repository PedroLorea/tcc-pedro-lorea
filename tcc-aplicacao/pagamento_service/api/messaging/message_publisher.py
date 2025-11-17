# publisher.py
import pika
import json

class MessagePublisher:
    """Centraliza envio de mensagens RabbitMQ."""

    def __init__(self, host='rabbitmq', port=5672, username='guest', password='guest', exchange: str = None):
        self.host = host
        self.port = port
        self.credentials = pika.PlainCredentials(username, password)
        self.default_exchange = exchange or "pagamentos"
        self.connection = None
        self.channel = None

    def _connect(self):
        if not self.connection or self.connection.is_closed:
            params = pika.ConnectionParameters(
                host=self.host,
                port=self.port,
                credentials=self.credentials
            )
            self.connection = pika.BlockingConnection(params)
            self.channel = self.connection.channel()

    def publish(self, routing_key: str, body: dict, exchange: str = None):
        """Publica mensagem JSON em uma exchange (padrão = default_exchange)."""
        self._connect()
        exchange_name = exchange or self.default_exchange

        # Garante que a exchange existe antes de publicar
        self.channel.exchange_declare(exchange=exchange_name, exchange_type="topic", durable=True)

        message = json.dumps(body)
        self.channel.basic_publish(
            exchange=exchange_name,
            routing_key=routing_key,
            body=message,
            properties=pika.BasicProperties(content_type="application/json", delivery_mode=2),
        )
        print(f"[MessageBus] Publicado evento {routing_key} em '{exchange_name}': {message}")

    def close(self):
        if self.connection and not self.connection.is_closed:
            self.connection.close()
