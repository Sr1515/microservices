import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Request, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { CreateLikeDto } from "./dtos/create-like.dto";
import { LikeService } from "./likes.service";


@Controller('likes')
export class LikeController {
    constructor(private readonly likeService: LikeService) { }

    @UseGuards(JwtAuthGuard)
    @Post()
    @HttpCode(HttpStatus.CREATED)
    async addlikePost(@Body() data: CreateLikeDto, @Request() req: any) {
        return this.likeService.create({
            postId: data.postId,
            userId: req.user.user_id,
        });
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async removeLikePost(@Param('id') id: string) {
        await this.likeService.delete(id)
    }

    @UseGuards(JwtAuthGuard)
    @Get('/by-post/:postId')
    async getlikesByPost(@Param('postId') postId: string) {
        return this.likeService.findByLikeId(postId);
    }
}
