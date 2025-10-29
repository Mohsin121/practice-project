import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDTO } from './dto/create-comment.dto';
import { GetUserId } from '../auth/decorators/get-userId.decorator';

@Controller('')
export class CommentsController {
    constructor(private readonly commentsService: CommentsService) {}
 
    @Post('posts/:postId/comments')
    createComment(
        @Body() data: CreateCommentDTO,
        @Param('postId') postId: string,
        @GetUserId() userId: string
    ){
        return this.commentsService.create(data, postId, userId);
    }

    @Post('comments/:commentId/reply')
    createReplyToComment(
        @Body() data: CreateCommentDTO,
        @Param('commentId') commentId: string,
        @GetUserId() userId: string
    ){
        return this.commentsService.createReplyToComment(data, commentId, userId);
    }

    @Get('posts/:postId/comments')
    findTopLevelComments(@Param('postId') postId: string){
        return this.commentsService.findTopLevelComments(postId);
    }

    @Get('comments/:commentId/replies')
    findRepliesToComment(@Param('commentId') commentId: string){
        return this.commentsService.findRepliesToComment(commentId);
    }


}
