import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateGroupDTO } from './dto/create-group.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class GroupService {
    constructor(private readonly prisma: PrismaService) {}


    async create(data: CreateGroupDTO, userId: string){
        const ownerRole = await this.prisma.role.findFirst({
            where: { name: 'OWNER' },
          });
        if (!ownerRole) {
            throw new NotFoundException('Owner role not found');
        }
        return this.prisma.group.create({
            data:{
                title: data.title,
                content: data.content,
                ownerId: userId,

                groupMember: {
                    create: {
                        userId: userId,
                        roleId: ownerRole.id,
                    },
                },
            },

            include: {
                groupMember: {
                    select: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                        joinedAt: true,
                    },
                }
            },
        })
    }
  
   
    async findAll(page: number, limit: number, search: string){
        return this.prisma.group.findMany({
            where: {
                OR: [
                    { title: { contains: search, mode: 'insensitive' } },
                    { content: { contains: search, mode: 'insensitive' } },
                ],
            },
            skip: (page - 1) * limit,
            take: limit,
            orderBy: {
                createdAt: 'desc',
            },
        })
    }


    async findMyGroups(userId: string, page: number, limit: number, search: string){
        return this.prisma.group.findMany({
            where: {
                ownerId: userId,
                OR: [
                    { title: { contains: search, mode: 'insensitive' } },
                    { content: { contains: search, mode: 'insensitive' } },
                ],
            },
            include: {
                groupMember: true,
            },
            skip: (page - 1) * limit,
            take: limit,
        })
    }

    async joinGroup(groupId: string, userId: string){
        const memberRole = await this.prisma.role.findFirst({
            where: { name: 'MEMBER' },
          });
        if (!memberRole) {
            throw new NotFoundException('Member role not found');
        }
        const group = await this.prisma.group.findUnique({
            where :{
                id: groupId,
            }
        })
        if (!group) {
            throw new NotFoundException('Group not found');
        }

        const existingMember = await this.prisma.groupMember.findUnique({
            where: {
                userId_groupId: {
                    userId: userId,
                    groupId: groupId,
                }
            }
        })
        if (existingMember) {
            throw new ConflictException('User already joined this group');
        }

            return this.prisma.groupMember.create({
                data: {
                    groupId: groupId,
                    userId: userId,
                    roleId: memberRole.id,
                },
            });
    }

}
