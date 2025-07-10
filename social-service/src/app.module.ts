import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { PostModule } from './post/post.module';


@Module({
  imports: [PostModule],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule { }
