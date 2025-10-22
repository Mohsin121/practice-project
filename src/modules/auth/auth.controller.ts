import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDTO } from './dto/register.dto';
import { LoginDTO } from './dto/login.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    async register(@Body() registerUserDTO: RegisterUserDTO) {
        return this.authService.register(registerUserDTO);
    }
    
    @HttpCode(HttpStatus.OK)
    @Post('login')
    async login(@Body() loginUserDTO: LoginDTO) {
        return this.authService.login(loginUserDTO);
    }
}
