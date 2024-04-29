import pika
import logging
import ssl
from cryptography.fernet import Fernet
from mail.mail_sender import send_email_with_registration_confirmation
from mail.mail_sender_executor import MailSenderExecutor

def callbackFunctionForEmailSend(ch, method, properties, body):
    print(body)
    # send_email_with_registration_confirmation(sender, body.decode("utf-8"))

sender = MailSenderExecutor()

logging.basicConfig(level=logging.INFO)

context = ssl.create_default_context(
    cafile="./app/keys/ca-cert.pem")
context.verify_mode = ssl.CERT_REQUIRED
context.load_cert_chain("./app/keys/client-cert.pem",
                        "./app/keys/client-key.pem")
ssl_options = pika.SSLOptions(context, "localhost")

key = b'lta4CbgGtEPPo9SwRvxc6RVbrZ3_dFF7su0Lx3-AGrg='
f = Fernet(key)

with open("./app/keys/rabbit_login.env", "rb") as encrypted_file:
    encrypted = encrypted_file.read()
login = f.decrypt(encrypted).decode("utf-8")

key = b'jTwDOWxyiKIhkyHY7AKu6qeO4TTP9_owNliiJfhpmKo='
f = Fernet(key)

with open("./app/keys/rabbit_password.env", "rb") as encrypted_file:
    encrypted = encrypted_file.read()
password = f.decrypt(encrypted).decode("utf-8")

credentials = pika.PlainCredentials(login, password)
conn_params = pika.ConnectionParameters(port=5672,
                                        ssl_options=ssl_options, credentials=credentials)
connection = pika.BlockingConnection(conn_params)

channel = connection.channel()
channel.exchange_declare('mail-exchange', durable=True, exchange_type='topic')
channel.queue_declare(queue= 'mail')

#Attaching consumer callback functions to respective queues that we wrote above
channel.basic_consume(queue='mail', on_message_callback=callbackFunctionForEmailSend, auto_ack=True)

#this will be command for starting the consumer session
channel.start_consuming()






