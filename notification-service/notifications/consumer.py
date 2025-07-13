import pika
import json

def start_social_event_consumer():
    connection = pika.BlockingConnection(
        pika.ConnectionParameters(
            host='localhost',
            credentials=pika.PlainCredentials('user', 'password')
        )
    )
    channel = connection.channel()

    channel.queue_declare(queue='social_events', durable=True)

    def callback(ch, method, properties, body):
        try:
            data = json.loads(body)
            pattern = data.get('pattern')
            payload = data.get('data')

            if pattern == 'post.liked':
                print("📣 Alguém curtiu seu post!")
                print("📦 Dados recebidos:", payload)

            elif pattern == 'post.commented':
                print("💬 Alguém comentou no seu post!")
                print("📦 Dados recebidos:", payload)

            else:
                print("ℹ️ Evento desconhecido recebido:", pattern)
                print("📦 Dados:", payload)

        except Exception as e:
            print("❌ Erro ao processar mensagem:", e)

        ch.basic_ack(delivery_tag=method.delivery_tag)

    channel.basic_consume(queue='social_events', on_message_callback=callback)

    print("🎧 Aguardando mensagens da fila 'social_events'...")
    channel.start_consuming()
