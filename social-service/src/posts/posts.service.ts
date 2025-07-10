import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Post } from 'generated/prisma';
import { PrismaService } from 'src/prisma/prisma.service';
import { S3Service } from 'src/s3/s3.service';
import { UpdatePostDto } from './dtos/posts';

@Injectable()
export class PostService {

    constructor(
        private prisma: PrismaService,
        private s3: S3Service
    ) { }

    async create(data: { content?: string; image?: Express.Multer.File; userId: string }): Promise<Post | null> {

        try {
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

        } catch (error) {
            throw new InternalServerErrorException('Error in create post');
        }
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

    async updateById(id: string, data: UpdatePostDto, image?: Express.Multer.File): Promise<Post> {
        try {
            const existingPost = await this.prisma.post.findUnique({ where: { id } });

            if (!existingPost) {
                throw new NotFoundException('Post not found');
            }

            let imageUrl: string | undefined;

            if (image) {
                if (existingPost.imageUrl) {
                    const oldKey = existingPost.imageUrl.split('/').pop();
                    if (oldKey) await this.s3.deleteFile(oldKey);
                }

                imageUrl = await this.s3.uploadFile(image);
            }

            const updated = await this.prisma.post.update({
                where: { id },
                data: {
                    ...data,
                    ...(imageUrl && { imageUrl }),
                },
            });

            return updated;

        } catch (error) {
            throw new InternalServerErrorException('Erro in update post');
        }
    }

    async deleteById(id: string): Promise<Post> {
        try {
            const existingPost = await this.prisma.post.findUnique({ where: { id } });

            if (!existingPost) {
                throw new NotFoundException('Post not found');
            }

            if (existingPost.imageUrl) {
                const key = existingPost.imageUrl.split('/').pop();
                if (key) await this.s3.deleteFile(key);
            }

            return this.prisma.post.delete({
                where: { id },
            });

        } catch (error) {
            console.error(error);
            throw new InternalServerErrorException('Error in delete post');
        }
    }


}