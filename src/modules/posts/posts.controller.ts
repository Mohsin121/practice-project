import { Body, Controller, Get, Post, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDTO } from './dto/create-post.dto';
import type { Request } from 'express';
import { GetUser } from '../auth/decorators';
import { Role, type User } from '@prisma/client';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('posts')
export class PostsController {
    constructor(private readonly postsService: PostsService) {}


    @Roles(Role.ADMIN)
    @Post()
    create(@Body() data: CreatePostDTO, @GetUser() user: User){
        const userId = user.id;
        if (!userId) {
            throw new UnauthorizedException('User not found');
        }
        return this.postsService.create(data, userId);
    }
  
    @Get()
    findAll(@Req() req: Request){
        if (!req.user) {
            throw new UnauthorizedException('User not found');
        }
        const userId = (req.user as User).id;
        return this.postsService.findAll(userId);
    }

}
