import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from 'src/auth/guards/auth.module';
import { CommentController } from './comments.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { CommentService } from './comments.service';
import { RabbitmqService } from 'src/rabbitmq/rabbitmq.service';

@Module({
    imports: [
        ConfigModule,
        AuthModule,
    ],
    controllers: [CommentController],
    providers: [CommentService, PrismaService, RabbitmqService],
})
export class CommentsModule { }
