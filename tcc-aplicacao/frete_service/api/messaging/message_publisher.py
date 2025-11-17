# publisher.py
import pika
import json

class MessagePublisher:
    """Centraliza envio de mensagens RabbitMQ."""

    def __init__(self, host='rabbitmq', port=5672, username='guest', password='guest', exchange: str = None):
        self.host = host
        self.port = port
        self.credentials = pika.PlainCredentials(username, password)
        self.exchange = exchange or "notificacoes"
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
            # Garantindo que a exchange existe
            self.channel.exchange_declare(exchange=self.exchange, exchange_type="topic", durable=True)

    def publish(self, routing_key: str, body: dict):
        """Publica mensagem em formato JSON."""
        self._connect()
        message = json.dumps(body)
        self.channel.basic_publish(
            exchange=self.exchange,
            routing_key=routing_key,
            body=message,
            properties=pika.BasicProperties(content_type="application/json", delivery_mode=2),  # mensagem persistente
        )
        print(f"[MessageBus] Publicado evento {routing_key}: {message}")

    def close(self):
        if self.connection and not self.connection.is_closed:
            self.connection.close()
