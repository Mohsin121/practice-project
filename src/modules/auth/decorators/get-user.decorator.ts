
import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

export const GetUser = createParamDecorator(
  async(data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const userId = request.user.id;

    if (!userId) {
      return null;
    }

    const prisma = new PrismaService();
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) {
      return new UnauthorizedException('User not found');
    }

    const { hash, ...userWithoutHash } = user;


    return userWithoutHash;
  },
);
