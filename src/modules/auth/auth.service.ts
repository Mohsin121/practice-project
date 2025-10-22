import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { RegisterUserDTO } from './dto/register.dto';
import { User } from '../users/entities/user.entity';
import { LoginDTO } from './dto/login.dto';
import bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
    ) { }

    async register(registerUserDTO: RegisterUserDTO): Promise<User> {
        const existingUser = await this.usersService.findByEmail(registerUserDTO.email)
        if (existingUser) {
            throw new ConflictException("User with this email already exists")
        }
        const newUser = await this.usersService.create(registerUserDTO)
        return newUser;

    }

    async login(loginUserDTO: LoginDTO) {
        const user = await this.usersService.findByEmail(loginUserDTO.email);
        if (!user) {
            throw new NotFoundException("Invalid email or password");
        }

        const isPasswordValid = await bcrypt.compare(loginUserDTO.password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException("Invalid email or password");
        }
        const accessToken = await this.generateToken(user._id as string, user.email);
        
        return {
            user:{
                _id: user._id,
                email: user.email,
                name: user.name,
            },
            accessToken, // Return token for cookie
          };
        
    }

    private async generateToken(userId: string, email: string): Promise<string> {
        const payload = { sub: userId, email };
        return this.jwtService.signAsync(payload, {
          secret: process.env.JWT_SECRET,
          expiresIn: '1d',
        });
      }

}
