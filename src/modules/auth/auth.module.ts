import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    UsersModule, 
    JwtModule.register({
      global: true,
    secret: process.env.JWT_SECRET,
    signOptions: { expiresIn: '1d' },
  })
],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService] // for the app module to use the auth service for authentication
})
export class AuthModule {}
