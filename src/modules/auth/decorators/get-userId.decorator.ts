
import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';

export const GetUserId = createParamDecorator(
  async(data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const userId = request.user.id;

    if (!userId) {
      throw new UnauthorizedException('User not found');
    }
    return userId;
  },
);
