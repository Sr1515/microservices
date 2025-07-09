import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PostService {

    constructor(
        private prisma: PrismaService,
    ) { }

    async create(data: { content?: string; image?: Express.Multer.File; userId: string }) {

        return this.prisma.post.create({
            data: {
                content: data.content,
                userId: data.userId
            }
        });
    }

    async getAll() {
        return this.prisma.post.findMany();
    }
}
