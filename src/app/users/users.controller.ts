import { Body, Controller, Post } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthService } from './services/auth.service';

@Controller('users')
export class UsersController {
	constructor(private readonly authService: AuthService) {}

	@Post('register')
	register(@Body() body: RegisterDto) {
		return this.authService.register(body);
	}

	@Post('login')
	login(@Body() body: LoginDto) {
		return this.authService.login(body);
	}
}
