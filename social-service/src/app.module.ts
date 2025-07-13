import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { PostModule } from './posts/posts.module';
import { CommentsModule } from './comments/comments.module';
import { LikesModule } from './likes/likes.module';
import { RabbitmqModule } from './rabbitmq/rabbitmq.module';

@Module({
  imports: [PostModule, CommentsModule, LikesModule, RabbitmqModule],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule { }
