import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { UserSettingDTO } from './dto/user-setting.dto';
import { UpdateUserDTO } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly prismaService: PrismaService,
  ) { }


  async findAll() {
    return this.prismaService.user.findMany({
     include: {userSetting: true}, 
     omit: {hash: true},
    });
  }

  async findOne(id: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: id
      },
      
      include: {
        userSetting: {
          select: {
            notifications: true,
            smsAlerts: true,
          },
        },
        post: {
          select: {
            id: true,
            title: true,
            content: true,
          },
        },
      },
      
    })
    if (!user) {
      throw new NotFoundException("User not found")
    }
    return user;
  }

  async update(id: string, data: UpdateUserDTO) {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException("User not found")
    }

    const updatedUser = await this.prismaService.user.update({
      where: {
        id: id
      },
      data: data,
      omit: {hash: true},
    })
    return updatedUser;
  }

  async updateSettings(userId: string, data: UserSettingDTO) {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: userId
      },
      include: {userSetting: true},
    })
    if (!user) {
      throw new NotFoundException("User not found")
    }
    if (!user.userSetting) {
      throw new NotFoundException("User setting not found")
    }

    const updatedUserSetting = await this.prismaService.userSetting.update({
      where: {
        userId
      },
      data: data,
    })

    return updatedUserSetting;
  }

}


