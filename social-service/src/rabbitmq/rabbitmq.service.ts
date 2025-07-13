import { Injectable, OnModuleInit } from "@nestjs/common";
import { ClientProxy, ClientProxyFactory, Transport } from "@nestjs/microservices";
import { lastValueFrom } from "rxjs";

@Injectable()
export class RabbitmqService implements OnModuleInit {
    private client: ClientProxy;

    onModuleInit() {
        this.client = ClientProxyFactory.create({
            transport: Transport.RMQ,
            options: {
                urls: [process.env.RABBITMQ_URI || 'amqp://user:password@rabbitmq:5672'],
                queue: 'social_events',
                queueOptions: { durable: true }
            },
        });
    }

    async emitEvent(pattern: string, data: any) {
        const observable = this.client.emit(pattern, data);
        return await lastValueFrom(observable);
    }

}