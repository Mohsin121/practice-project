import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePostDTO } from './dto/create-post.dto';

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

    async findAll(authorId: string){
        return this.prisma.post.findMany({
            where: {
                authorId: authorId,
            },
        });
    }
}
