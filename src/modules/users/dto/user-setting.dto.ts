import { IsBoolean, IsOptional } from "class-validator";
import { Transform } from "class-transformer";

export class UserSettingDTO {

    @IsOptional()
    @Transform(({ value }) => {
      if (value === 'true') return true;
      if (value === 'false') return false;
      return value;
    })
    @IsBoolean()
    notifications?: boolean;

    @IsOptional()
    @Transform(({ value }) => {
      if (value === 'true') return true;
      if (value === 'false') return false;
      return value;
    })
    @IsBoolean()
    smsAlerts?: boolean;

}