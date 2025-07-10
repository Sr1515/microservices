import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Request, UseGuards } from "@nestjs/common";
import { CommentService } from "./comments.service";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { CreateCommentDto } from "./dtos/create-comment.dto";
import { UpdateCommentDto } from "./dtos/update-comment.dto";


@Controller('comments')
export class CommentController {
    constructor(private readonly commentService: CommentService) { }

    @UseGuards(JwtAuthGuard)
    @Post()
    @HttpCode(HttpStatus.CREATED)
    async createComment(@Body() data: CreateCommentDto, @Request() req: any,) {
        return this.commentService.create({
            ...data,
            userId: req.user.user_id
        });
    }

    @UseGuards(JwtAuthGuard)
    @Get('/by-post/:postId')
    async getCommentsByPost(@Param('postId') postId: string) {
        return this.commentService.findByPostId(postId);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteComment(@Param('id') id: string) {
        await this.commentService.delete(id)
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    @HttpCode(HttpStatus.OK)
    async updatePostById(
        @Param('id') id: string,
        @Body() data: UpdateCommentDto,
    ) {
        return this.commentService.updateComment(id, data);
    }

}
