import {
    Body,
    Controller,
    Get,
    Post,
    Request,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PostService } from './post.service';
import { get } from 'http';

@Controller('post')
export class PostController {
    constructor(private readonly postService: PostService) { }

    @Post()
    @UseInterceptors(FileInterceptor('image'))
    async createPost(
        @UploadedFile() image: Express.Multer.File,
        @Body('content') content: string,
        @Request() req: any,
    ) {
        return this.postService.create({
            content,
            image,
            userId: req.user.id,
        });
    }


    @Get()
    async getAllPosts() {
        return this.postService.getAll()
    }
}
