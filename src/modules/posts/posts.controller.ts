import { Body, Controller, Get, Post, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { PostsService } from './posts.service';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { CreatePostDTO } from './dto/create-post.dto';
import type { Request } from 'express';
import { GetUser } from '../auth/decorators';
import type { User } from '@prisma/client';

@Controller('posts')
export class PostsController {
    constructor(private readonly postsService: PostsService) {}


    @UseGuards(JwtAuthGuard)
    @Post()
    create(@Body() data: CreatePostDTO, @GetUser() user: User){
        const userId = user.id;
        if (!userId) {
            throw new UnauthorizedException('User not found');
        }
        return this.postsService.create(data, userId);
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    findAll(@GetUser() user: User){
        return this.postsService.findAll(user.id);
    }

}
