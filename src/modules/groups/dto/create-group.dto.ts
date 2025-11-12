import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class CreateGroupDTO {

    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(255)
    title: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(255)
    content: string;

}