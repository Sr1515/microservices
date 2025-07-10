import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { Like } from "generated/prisma";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateLikeDto } from "./dtos/create-like.dto";

@Injectable()
export class LikeService {

    constructor(
        private prisma: PrismaService,
    ) { }

    async create(data: { postId: string; userId: string }): Promise<CreateLikeDto> {
        try {
            const liked = await this.prisma.like.findUnique({
                where: {
                    userId_postId: {
                        userId: data.userId,
                        postId: data.postId,
                    },
                },
            });

            if (liked) {
                throw new BadRequestException('Você já curtiu esse post.');
            }

            return await this.prisma.like.create({
                data: {
                    postId: data.postId,
                    userId: data.userId,
                },
            });

        } catch (error) {
            if (error instanceof BadRequestException) {
                throw error;
            }

            throw new InternalServerErrorException('Erro ao curtir post');
        }
    }

    async delete(id: string): Promise<void> {
        try {
            const existingLike = await this.prisma.like.findUnique({
                where: { id },
            });

            if (!existingLike) {
                throw new NotFoundException('Like not found');
            }

            await this.prisma.like.delete({
                where: { id },
            });

        } catch (error) {
            throw new InternalServerErrorException('Erro ao deletar like');
        }
    }

    async findByLikeId(postId: string): Promise<Like[] | null> {
        try {
            return this.prisma.like.findMany({
                where: { postId },
                orderBy: { createdAt: 'desc' }
            });
        } catch (error) {
            throw new InternalServerErrorException('posts not found')
        }
    }

}