import {
	IsBoolean,
	IsEmail,
	IsNotEmpty,
	IsOptional,
	IsString,
	ValidateIf
} from 'class-validator';

export class LoginDto {
	@IsEmail()
	@IsNotEmpty()
	email: string;

	@IsString()
	@IsNotEmpty()
	password: string;

	@IsOptional()
	@ValidateIf((_, value) => value !== undefined)
	@IsBoolean()
	remember_me?: boolean;
}
