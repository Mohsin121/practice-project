import { Body, Controller, HttpCode, HttpStatus, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDTO } from './dto/register.dto';
import { LoginDTO } from './dto/login.dto';
import type { Response } from 'express';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    async register(@Body() registerUserDTO: RegisterUserDTO) {
        return this.authService.register(registerUserDTO);
    }
    
    @HttpCode(HttpStatus.OK)
    @Post('login')
    async login(
        @Body() loginUserDTO: LoginDTO,
        @Res({passthrough: true}) res: Response) {
        const {user, accessToken} = await this.authService.login(loginUserDTO);
        res.cookie('access_token',accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000, // 1 day
        });
        return {
            message: 'Login successful',
            user,
        }

    }

    @HttpCode(HttpStatus.OK)
    @Post('logout')
    async logout(@Res({ passthrough: true }) res: Response) {
      // Clear the cookie
      res.clearCookie('access_token');
      return { message: 'Logout successful' };
    }
}
