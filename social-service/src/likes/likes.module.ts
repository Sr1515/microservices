import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from 'src/auth/guards/auth.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { LikeService } from './likes.service';
import { LikeController } from './likes.controller';
import { RabbitmqService } from 'src/rabbitmq/rabbitmq.service';

@Module({
    imports: [
        ConfigModule,
        AuthModule,
    ],
    controllers: [LikeController],
    providers: [LikeService, PrismaService, RabbitmqService],
})
export class LikesModule { }
