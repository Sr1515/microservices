import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Post } from 'generated/prisma';
import { PrismaService } from 'src/prisma/prisma.service';
import { S3Service } from 'src/s3/s3.service';

@Injectable()
export class PostService {

    constructor(
        private prisma: PrismaService,
        private s3: S3Service
    ) { }

    async create(data: { content?: string; image?: Express.Multer.File; userId: string }): Promise<Post | null> {

        let imageUrl: string | null = null;

        if (data.image) {
            imageUrl = await this.s3.uploadFile(data.image);
        }

        return this.prisma.post.create({
            data: {
                content: data.content,
                imageUrl,
                userId: data.userId
            }
        });
    }

    async getAll(): Promise<Post[] | null> {
        try {
            return this.prisma.post.findMany();
        } catch (error) {
            throw new InternalServerErrorException('Error fetching posts');
        }

    }

    async getById(id: string): Promise<Post | null> {
        try {
            return await this.prisma.post.findUnique({
                where: { id }
            });
        } catch (error) {
            throw new InternalServerErrorException('Error fetching posts');
        }
    }
}