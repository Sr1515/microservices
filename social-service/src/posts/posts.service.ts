import { HttpException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
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

            return await this.prisma.post.create({
                data: {
                    content: data.content,
                    imageUrl,
                    userId: data.userId,
                },
            });

        } catch (error) {
            console.error('Error in create post:', error);

            if (error instanceof HttpException) {
                throw error;
            }

            throw new InternalServerErrorException('Error in create post');
        }
    }

    async getAll(): Promise<Post[] | null> {
        try {
            return await this.prisma.post.findMany();
        } catch (error) {
            console.error('Error fetching posts:', error);

            if (error instanceof HttpException) {
                throw error;
            }

            throw new InternalServerErrorException('Error fetching posts');
        }
    }

    async getById(id: string): Promise<Post | null> {
        try {
            const post = await this.prisma.post.findUnique({ where: { id } });

            if (!post) {
                throw new NotFoundException('Post not found');
            }

            return post;

        } catch (error) {
            console.error('Error fetching post by id:', error);

            if (error instanceof HttpException) {
                throw error;
            }

            throw new InternalServerErrorException('Error fetching post');
        }
    }

    async updateById(id: string, data: UpdatePostDto, image?: Express.Multer.File
    ): Promise<Post> {
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

            const updateData: any = {};
            if (data.content !== undefined) updateData.content = data.content;
            if (imageUrl) updateData.imageUrl = imageUrl;

            const updatedPost = await this.prisma.post.update({
                where: { id },
                data: updateData,
            });

            return updatedPost;
        } catch (error) {
            console.error('Error in update post:', error);
            if (error instanceof HttpException) throw error;
            throw new InternalServerErrorException('Error in update post');
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
                if (key) {
                    await this.s3.deleteFile(key);
                }
            }

            return await this.prisma.post.delete({ where: { id } });

        } catch (error) {
            console.error('Error in delete post:', error);

            if (error instanceof HttpException) {
                throw error;
            }

            throw new InternalServerErrorException('Error in delete post');
        }
    }
}
