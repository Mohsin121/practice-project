import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDTO } from './dto/register.dto';
import { LoginDTO } from './dto/login.dto';
import type { Response , Request } from 'express';
import {generateCsrfToken} from 'src/utils/generateCsrfToken';


@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}
  

   @Get('csrf-token')
  getCsrfToken(@Req() req: Request, @Res() res: Response) {
    const csrfToken = generateCsrfToken(req, res); 
    return res.json({ csrfToken });
  }

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
