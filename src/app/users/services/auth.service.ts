import { Injectable } from '@nestjs/common';
import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';
import { UserService } from './users.service';

@Injectable()
export class AuthService {
	constructor(private readonly userService: UserService) {}

	async register(input: RegisterDto) {}

	async login(input: LoginDto) {}
}
