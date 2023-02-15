import { IsNumberString, IsString } from "class-validator";

export class ResetPasswordDto {
    @IsNumberString()
    code: string;

    @IsString()
    password: string;
}