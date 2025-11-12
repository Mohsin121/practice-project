import { IsInt, IsNotEmpty, IsNumber, isNumber, IsString } from "class-validator";

export class CreatePostDTO {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    content: string;


}