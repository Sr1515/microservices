import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Patch,
    Post,
    Request,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PostService } from './post.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UpdatePostDto } from './dtos/posts';

@Controller('posts')
export class PostController {
    constructor(private readonly postService: PostService) { }

    @UseGuards(JwtAuthGuard)
    @Post()
    @UseInterceptors(FileInterceptor('image'))
    @HttpCode(HttpStatus.CREATED)
    async createPost(
        @UploadedFile() image: Express.Multer.File,
        @Body('content') content: string,
        @Request() req: any,
    ) {
        return this.postService.create({
            content,
            image,
            userId: req.user.user_id,
        });
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    @HttpCode(HttpStatus.OK)
    async getAllPosts() {
        return this.postService.getAll();
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    @HttpCode(HttpStatus.OK)
    async getPostById(@Param('id') id: string) {
        return this.postService.getById(id);
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    @UseInterceptors(FileInterceptor('image'))
    @HttpCode(HttpStatus.OK)
    async updatePostById(
        @Param('id') id: string,
        @UploadedFile() image: Express.Multer.File,
        @Body() data: UpdatePostDto,
    ) {
        return this.postService.updateById(id, data, image);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteById(@Param('id') id: string) {
        await this.postService.deleteById(id);
        return;
    }
}
