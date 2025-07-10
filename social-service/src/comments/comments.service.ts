import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { Comment } from "generated/prisma";
import { PrismaService } from "src/prisma/prisma.service";
import { UpdateCommentDto } from "./dtos/update-comment.dto";

@Injectable()
export class CommentService {

    constructor(
        private prisma: PrismaService,
    ) { }

    async create(data: { content: string; postId: string; userId: string }): Promise<Comment | null> {
        try {
            return this.prisma.comment.create({
                data: {
                    content: data.content,
                    postId: data.postId,
                    userId: data.userId,
                },
            });
        } catch (error) {
            throw new InternalServerErrorException('Error in create Comment')
        }
    }

    async delete(id: string): Promise<void> {
        try {
            const existingComment = await this.prisma.comment.findUnique({
                where: { id },
            });

            if (!existingComment) {
                throw new NotFoundException('Comment not found');
            }

            await this.prisma.comment.delete({
                where: { id },
            });
        } catch (error) {
            throw new InternalServerErrorException('Erro in delete comment');
        }
    }

    async findByPostId(postId: string): Promise<Comment[] | null> {
        try {
            return this.prisma.comment.findMany({
                where: { postId },
                orderBy: { createdAt: 'desc' }
            });
        } catch (error) {
            throw new InternalServerErrorException('posts not found')
        }
    }

    async updateComment(id: string, data: UpdateCommentDto): Promise<Comment> {
        try {
            const existingComment = await this.prisma.comment.findUnique({ where: { id } });

            if (!existingComment) {
                throw new NotFoundException('Comentário não encontrado');
            }

            const updated = await this.prisma.comment.update({
                where: { id },
                data,
            });

            return updated;

        } catch (error) {
            throw new InternalServerErrorException('Erro ao atualizar comentário');
        }
    }


}