import { IsBoolean, IsNotEmpty, IsOptional } from "class-validator";

export class UserSettingDTO {


    @IsNotEmpty()
    @IsBoolean()
    @IsOptional()
    smsAlerts: boolean;

    @IsNotEmpty()
    @IsBoolean()
    @IsOptional()
    notifications: boolean;

}