import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from 'src/modules/auth/decorators/roles.decorator';
import { GlobalRole } from '@prisma/client';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<GlobalRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      // console.log('No roles required, allow access');
      return true; // No roles required, allow access
    }

    const { user } = context.switchToHttp().getRequest();
    if (!user) {
      // console.log('Roles required but no user found, deny access');
      return false; // Roles required but no user found, deny access
    }

    // console.log('Required roles:', requiredRoles);
    // console.log('User role:', user.role);
    // console.log('Access granted:', requiredRoles.includes(user.role));

    return requiredRoles.includes(user.role);
  }
}
