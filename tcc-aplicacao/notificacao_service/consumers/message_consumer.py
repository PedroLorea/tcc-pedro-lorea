# common/message_bus.py
import pika
import json

import time
import pika

class MessageConsumer:
    def __init__(self, host='rabbitmq', port=5672, username='guest', password='guest', retries=5, delay=5):
        self.host = host
        self.port = port
        self.credentials = pika.PlainCredentials(username, password)
        self.subscriptions = []

        attempt = 0
        while attempt < retries:
            try:
                self.connection = pika.BlockingConnection(
                    pika.ConnectionParameters(host=self.host, port=self.port, credentials=self.credentials)
                )
                self.channel = self.connection.channel()
                print("[✔] Conectado ao RabbitMQ")
                break
            except pika.exceptions.AMQPConnectionError as e:
                attempt += 1
                print(f"[❌] Falha ao conectar, tentativa {attempt}/{retries}... erro: {e}")
                time.sleep(delay)
        else:
            raise ConnectionError(f"Não foi possível conectar ao RabbitMQ após {retries} tentativas")


    def subscribe(self, queue, routing_key):
        """
        Decorador para registrar consumidores de mensagens.
        """
        def decorator(callback):
            self.subscriptions.append((queue, routing_key, callback))
            return callback
        return decorator

    def _create_bindings(self, exchange='notificacoes'):
        """
        Garante que filas e bindings estão configurados.
        """
        self.channel.exchange_declare(exchange=exchange, exchange_type='topic', durable=True)
        for queue, routing_key, _ in self.subscriptions:
            print("queue_declare")
            print("exchange: ", exchange)
            self.channel.queue_declare(queue=queue, durable=True)
            self.channel.queue_bind(exchange=exchange, queue=queue, routing_key=routing_key)

    def _make_callback(self, user_callback):
        def callback(ch, method, properties, body):
            mensagem = json.loads(body)
            try:
                user_callback(mensagem)
                ch.basic_ack(delivery_tag=method.delivery_tag)
            except Exception as e:
                print(f"[❌] Erro processando mensagem: {e}")
                ch.basic_nack(delivery_tag=method.delivery_tag)
        return callback

    def start(self, exchange='notificacoes'):
        self._create_bindings(exchange)
        for queue, _, callback in self.subscriptions:
            wrapped = self._make_callback(callback)
            self.channel.basic_consume(queue=queue, on_message_callback=wrapped)
        print("[*] Aguardando mensagens...")
        self.channel.start_consuming()

    def stop(self):
        if self.channel and self.channel.is_open:
            self.channel.stop_consuming()
        if self.connection and self.connection.is_open:
            self.connection.close()
