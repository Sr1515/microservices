import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { PostModule } from './posts/posts.module';
import { CommentsModule } from './comments/comments.module';
import { LikesModule } from './likes/likes.module';

@Module({
  imports: [PostModule, CommentsModule, LikesModule],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule { }
