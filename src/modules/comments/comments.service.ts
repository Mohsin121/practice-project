import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCommentDTO } from './dto/create-comment.dto';

@Injectable()
export class CommentsService {
    constructor(private readonly prisma: PrismaService) {}


    async create(data: CreateCommentDTO, postId: string, userId: string){
        const post = await this.prisma.post.findUnique({
            where: {
                id: postId,
            },
        });
        if (!post) {
            throw new NotFoundException('Post not found');
        }
        return this.prisma.comment.create({
            data: {
                content: data.content,
                postId: postId,
                commentedById: userId,
            },
        });
    }

    async createReplyToComment(data: CreateCommentDTO, commentId: string, userId: string){
     const parentComment = await this.prisma.comment.findUnique({
        where:{
            id: commentId,
        }
    });
    if (!parentComment) {
        throw new NotFoundException('Comment not found');
    }
    return this.prisma.comment.create({
         data:{
            content: data.content,
            postId: parentComment.postId,
            commentedById: userId,
            parentCommentId: commentId,
        },
    });
  }

  async findTopLevelComments(postId: string){
    return this.prisma.comment.findMany({
        where: {
            postId: postId,
            parentCommentId: null,
        },
        include: {
            _count: {
              select: { replies: true },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
    });
  }

  async findRepliesToComment(commentId: string){
    return this.prisma.comment.findMany({
        where: {
            parentCommentId: commentId,
        },
    
    include: {
        _count: {
          select: { replies: true },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
