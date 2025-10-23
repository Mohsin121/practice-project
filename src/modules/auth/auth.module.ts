import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [
    JwtModule.register({
      global: true,
    secret: process.env.JWT_SECRET,
    signOptions: { expiresIn: '1d' },
  }),
  PrismaModule,
],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
