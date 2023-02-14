import { Body, Controller, Get, HttpCode, Post, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { RoleEnum, UseRole } from 'src/decorators/role.decorator';
import { HidePasswordInterceptor } from 'src/interceptors/hide-password.interceptor';
import { ApiGetMe, ApiLogin, ApiRegister } from './auth.swagger';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { User } from './schemas/user.schema';
import { AuthService } from './services/auth.service';

@Controller('auth')
@ApiTags('Auth')
// @UseInterceptors(MongooseClassSerializerInterceptor(User))
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('register')
	@UseInterceptors(HidePasswordInterceptor)
	@ApiRegister()
	register(@Body() body: RegisterDto) {
		return this.authService.register(body);
	}

	@Post('login')
	@HttpCode(200)
	@ApiLogin()
	login(@Body() body: LoginDto) {
		return this.authService.login(body);
	}

	@Get('me')
	@ApiGetMe()
	getMe(@CurrentUser() user: User) {
		return user;
	}
}
