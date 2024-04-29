import pika
import logging
import ssl
from cryptography.fernet import Fernet


class QueueSender:

    def __init__(self):
        self.initialize_connection()

    def initialize_connection(self):
        try:
            logging.basicConfig(level=logging.INFO)

            context = ssl.create_default_context(
                cafile="./rabbit_keys/ca-cert.pem")
            context.verify_mode = ssl.CERT_REQUIRED
            context.load_cert_chain("./rabbit_keys/client-cert.pem",
                                    "./rabbit_keys/client-key.pem")
            ssl_options = pika.SSLOptions(context, "localhost")

            key = b'lta4CbgGtEPPo9SwRvxc6RVbrZ3_dFF7su0Lx3-AGrg='
            f = Fernet(key)

            with open("./rabbit_keys/rabbit_login.env", "rb") as encrypted_file:
                encrypted = encrypted_file.read()
            login = f.decrypt(encrypted).decode("utf-8")

            key = b'jTwDOWxyiKIhkyHY7AKu6qeO4TTP9_owNliiJfhpmKo='
            f = Fernet(key)

            with open("./rabbit_keys/rabbit_password.env", "rb") as encrypted_file:
                encrypted = encrypted_file.read()
            password = f.decrypt(encrypted).decode("utf-8")

            credentials = pika.PlainCredentials(login, password)
            conn_params = pika.ConnectionParameters(port=5672,
                                                    ssl_options=ssl_options, credentials=credentials)
            connection = pika.BlockingConnection(conn_params)

            self.channel= connection.channel()
            self.channel.exchange_declare('mail-exchange', durable=True, exchange_type='topic')
            self.channel.queue_declare(queue= 'mail')
            self.channel.queue_bind(exchange='mail-exchange', queue='mail', routing_key='m')
        except Exception:
            pass
    def send_to_queue(self, email: str):
        try:
            self.channel.basic_publish(exchange='mail-exchange', routing_key='m', body= email)
        except Exception:
            self.initialize_connection()

    def close_connection(self):
        try:
            self.channel.close()
        except Exception:
            pass
        