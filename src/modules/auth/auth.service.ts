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

    async validateUser(email: string, password: string) {
        const user = await this.prismaService.user.findUnique({
            where:{
                email: email,
            }
        })
        if (!user) {
            throw new NotFoundException("User not found");
        }
        const isPasswordValid = await bcrypt.compare(password, user.hash);
        if (!isPasswordValid) {
            throw new UnauthorizedException("Invalid email or password");
        }
        const { hash, ...userWithoutHash } = user;
        return userWithoutHash;
    }

    async login(user: any) {
        const payload = { sub: user.id, email: user.email };

        const accessToken = await this.jwtService.signAsync(payload, {
            secret: process.env.JWT_SECRET,
            expiresIn: '1d',
          });

          return {
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
              },
              accessToken,
          };
        
    }


}
