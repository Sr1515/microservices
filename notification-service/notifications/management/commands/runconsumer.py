from django.core.management.base import BaseCommand
from notifications.consumer import start_social_event_consumer

class Command(BaseCommand):
    help = 'Inicia o consumer do RabbitMQ para eventos sociais.'

    def handle(self, *args, **options):
        self.stdout.write("🎧 Iniciando o consumer de notificações...")
        start_social_event_consumer()
