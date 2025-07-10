import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigModule } from '@nestjs/config';
import { S3Service } from 'src/s3/s3.service';
import { AuthModule } from 'src/auth/guards/auth.module';

@Module({
  imports: [
    ConfigModule,
    AuthModule,
  ],
  controllers: [PostController],
  providers: [PostService, S3Service, PrismaService],
})
export class PostModule { }
