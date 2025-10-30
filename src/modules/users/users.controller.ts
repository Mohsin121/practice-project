import { 
  Body, 
  Controller, 
  Get, 
  Param, 
  Patch, 
  UploadedFile, 
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDTO } from './dto/update-user.dto';
import { UserSettingDTO } from './dto/user-setting.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from 'src/config/multer.config';
import { GetUserId } from '../auth/decorators/get-userId.decorator';
import { UploadsService } from '../uploads/uploads.service';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService,
    private readonly uploadsService: UploadsService,
  ) {}

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Patch('settings')
  @UseInterceptors(FileInterceptor('profileImage', multerConfig))
  async updateSettings(
    @GetUserId() userId: string,
    @Body() data: UserSettingDTO,
    @UploadedFile() profileImage?: Express.Multer.File
  ) {
   
    if (!userId) {
      throw new BadRequestException('User ID not found. Are you authenticated?');
    }

    let filePath: string | null = null;

    if (profileImage) {
      try {
        const uploaded = await this.uploadsService.uploadFile(profileImage);
        filePath = uploaded.path;
      } catch (error) {
        throw new BadRequestException('Failed to upload profile image');
      }
    }

    return this.userService.updateSettings(userId, data, filePath);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: UpdateUserDTO) {
    return this.userService.update(id, data);
  }

  
}
