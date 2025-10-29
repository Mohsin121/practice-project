import { Body, Controller, Get, Param, Post, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDTO } from './dto/create-post.dto';
import type { Request } from 'express';
import { GetUser } from '../auth/decorators';
import { GlobalRole, type User } from '@prisma/client';
import { Roles } from '../auth/decorators/roles.decorator';
import { GetUserId } from '../auth/decorators/get-userId.decorator';
import { CreateGroupPostDTO } from './dto/create-group-post.dto';

@Controller('posts')
export class PostsController {
    constructor(private readonly postsService: PostsService) {}


    // @Roles(GlobalRole.USER)
    @Post()
    create(@Body() data: CreatePostDTO, @GetUser() user: User){
        const userId = user.id;
        if (!userId) {
            throw new UnauthorizedException('User not found');
        }
        return this.postsService.create(data, userId);
    }

    // @Roles(GlobalRole.USER)
    @Post('group')
    createGroupPost(@Body() data: CreateGroupPostDTO, @GetUserId() userId: string){
        return this.postsService.createGroupPost(data, userId);
    }

    @Post(':postId/like')
    toggleLikePost(@Param('postId') postId: string, @GetUserId() userId: string){
        return this.postsService.toggleLikePost(postId, userId);
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
