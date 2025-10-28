import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePostDTO } from './dto/create-post.dto';
import { CreateGroupPostDTO } from './dto/create-group-post.dto';

@Injectable()
export class PostsService {
    constructor(private readonly prisma: PrismaService) {}

    async create(data: CreatePostDTO, authorId: string ){
       
        return this.prisma.post.create({
            data:{
                title: data.title,
                content: data.content,
                authorId: authorId,
            },
        });
    }

    async createGroupPost(data: CreateGroupPostDTO, authorId: string ){
       const group = await this.prisma.group.findUnique({
        where: {
            id: data.groupId,
        },
       });
       if (!group) {
        throw new NotFoundException('Group not found');
       }
       const isMember = await this.prisma.groupMember.findUnique({
        where: {
            userId_groupId: {
                userId: authorId,
                groupId: data.groupId,
            },
        },
       });
       if (!isMember) {
        throw new ForbiddenException('You are not a member of this group');
       }
        return this.prisma.post.create({
            data:{
                title: data.title,
                content: data.content,
                authorId: authorId,
                groupId: data.groupId,
            },
        });
    }

    async findAll(authorId: string){
        return this.prisma.post.findMany({
            where: {
                authorId: authorId,
            },
        });
    }
}
