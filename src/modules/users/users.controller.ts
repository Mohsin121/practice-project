import { Body, Controller, Get, Param,  Patch } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDTO } from './dto/update-user.dto';
import { UserSettingDTO } from './dto/user-setting.dto';

@Controller('users')
export class UsersController {
  constructor (private readonly userService: UsersService) {}

  @Get()
  findAll(){
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string){
    return this.userService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: UpdateUserDTO){
    return this.userService.update(id, data);
  }

  @Patch(':id/settings')
  updateSettings(@Param('id') id: string, @Body() data: UserSettingDTO){
    return this.userService.updateSettings(id, data);
  }
}
