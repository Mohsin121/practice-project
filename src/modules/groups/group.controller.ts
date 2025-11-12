import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { GroupService } from './group.service';
import { CreateGroupDTO } from './dto/create-group.dto';
import { GetUserId } from '../auth/decorators/get-userId.decorator';
import { Public } from '../auth/decorators';

@Controller('groups')
export class GroupController {
    constructor(private readonly groupService: GroupService) {}

    @Post()
    create(@Body() data: CreateGroupDTO , @GetUserId() userId: string){
        return this.groupService.create(data, userId);
    }

    @Public()
    @Get()
    findAll(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
        @Query('search') search: string = ''
        ){
        return this.groupService.findAll( page, limit, search);
    }

    @Get("my")
    findMyGroups(
        @GetUserId() userId: string,
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
        @Query('search') search: string = ''
        ){
        return this.groupService.findMyGroups(userId, page, limit, search);
    }

    @Post(':id/join')
    joinGroup(@Param('id') groupId: string, @GetUserId() userId: string){
        return this.groupService.joinGroup(groupId, userId);
    }
}
