import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { PostModule } from './posts/posts.module';
import { CommentsModule } from './comments/comments.module';

@Module({
  imports: [PostModule, CommentsModule],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule { }
