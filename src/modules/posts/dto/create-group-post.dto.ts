import { IsInt, IsNotEmpty, IsNumber, isNumber, IsString } from "class-validator";

export class CreateGroupPostDTO {
    
    @IsString()
    @IsNotEmpty()
    groupId: string;

    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    content: string;


}