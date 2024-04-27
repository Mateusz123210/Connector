import pika

def send_to_queue(email: str):

    credentials = pika.PlainCredentials('RabCon2104','ho65Pu64sSKMnJK')
    connection= pika.BlockingConnection(pika.ConnectionParameters(host='localhost', port='5672', credentials= credentials))
    channel= connection.channel()
    channel.exchange_declare('mail-exchange', durable=True, exchange_type='topic')
    channel.queue_declare(queue= 'mail')
    channel.queue_bind(exchange='mail-exchange', queue='mail', routing_key='m')

    channel.basic_publish(exchange='mail-exchange', routing_key='m', body= email)
    channel.close()