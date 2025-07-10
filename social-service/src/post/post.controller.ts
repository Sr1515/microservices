import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    Request,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PostService } from './post.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('posts')
export class PostController {
    constructor(private readonly postService: PostService) { }

    @UseGuards(JwtAuthGuard)
    @Post()
    @UseInterceptors(FileInterceptor('image'))
    async createPost(
        @UploadedFile() image: Express.Multer.File,
        @Body('content') content: string,
        @Request() req: any,
    ) {
        console.log(req.user)

        return this.postService.create({
            content,
            image,
            userId: req.user.user_id,
        });
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    async getAllPosts() {
        return this.postService.getAll()
    }

    @UseGuards(JwtAuthGuard)
    @Get('/:id')
    async getUserById(@Param('id') id: string) {
        return this.postService.getById(id)
    }
}
