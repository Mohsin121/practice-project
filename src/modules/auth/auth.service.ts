import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { RegisterUserDTO } from './dto/register.dto';
import { User } from '../users/entities/user.entity';
import { LoginDTO } from './dto/login.dto';
import bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {

    constructor(
        private readonly prismaService: PrismaService,
        private readonly jwtService: JwtService,
    ) { }

    async register(registerUserDTO: RegisterUserDTO){
        const hashedPassword = await bcrypt.hash(registerUserDTO.password, 10)
        const newUser = await this.prismaService.user.create({
            data: {
                email: registerUserDTO.email,
                hash: hashedPassword,
                name: registerUserDTO.name,
            }
      
        })

        return newUser;
    }

    // async login(loginUserDTO: LoginDTO) {
    //     const user = await this.usersService.findByEmail(loginUserDTO.email);
    //     if (!user) {
    //         throw new NotFoundException("Invalid email or password");
    //     }

    //     const isPasswordValid = await bcrypt.compare(loginUserDTO.password, user.password);
    //     if (!isPasswordValid) {
    //         throw new UnauthorizedException("Invalid email or password");
    //     }
    //     const accessToken = await this.generateToken(user._id as string, user.email);
        
    //     return {
    //         user:{
    //             _id: user._id,
    //             email: user.email,
    //             name: user.name,
    //         },
    //         accessToken, // Return token for cookie
    //       };
        
    // }

    // private async generateToken(userId: string, email: string): Promise<string> {
    //     const payload = { sub: userId, email };
    //     return this.jwtService.signAsync(payload, {
    //       secret: process.env.JWT_SECRET,
    //       expiresIn: '1d',
    //     });
    //   }

}
