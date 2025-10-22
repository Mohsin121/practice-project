import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from './entities/user.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDTO } from './dto/create-user.dto';
import  bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
    ) {}

    async create(createUserDTO: CreateUserDTO) : Promise<User>{
        const hashedPassword = await bcrypt.hash(createUserDTO.password, 10)
      const newUser = new this.userModel({...createUserDTO, password: hashedPassword});
      return newUser.save()
    }

    async findAll() : Promise<User[]>{
        return this.userModel.find().select('-password').exec()
    }

    async findOne(id: string) : Promise<User>{
        const user= await this.userModel.findById(id).select('-password').exec();
         if(!user){
            throw new NotFoundException("User not found")
         }
         return user;
    }

    async findByEmail(email: string) : Promise<User | null>{
        return this.userModel.findOne({email}).exec();
    }
}


