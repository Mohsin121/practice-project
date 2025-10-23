import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { RegisterUserDTO } from './dto/register.dto';
import { User } from '../users/entities/user.entity';
import { LoginDTO } from './dto/login.dto';
import bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class AuthService {

    constructor(
        private readonly prismaService: PrismaService,
        private readonly jwtService: JwtService,
    ) { }

    async register(registerUserDTO: RegisterUserDTO){
        const hashedPassword = await bcrypt.hash(registerUserDTO.password, 10)
    try {
        const newUser = await this.prismaService.user.create({
            data: {
                email: registerUserDTO.email,
                hash: hashedPassword,
                name: registerUserDTO.name,
            }
      
        })

        const { hash, ...user} = newUser;

        return user;
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2002') {
                throw new ConflictException("User with this email already exists");
            }
        }
        throw error;
    }
       
    }

    async login(loginUserDTO: LoginDTO) {
        const user = await this.prismaService.user.findUnique({
            where:{
                email: loginUserDTO.email,
            }
        })

        if (!user) {
            throw new NotFoundException("Invalid email or password");
        }



        const isPasswordValid = await bcrypt.compare(loginUserDTO.password, user.hash);
        if (!isPasswordValid) {
            throw new UnauthorizedException("Invalid email or password");
        }
        const accessToken = await this.generateToken(user.id.toString(), user.email);
        
        return {
            user:{
                id: user.id,
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
