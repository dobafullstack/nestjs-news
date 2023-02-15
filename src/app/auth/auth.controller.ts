import {
	Body,
	Controller,
	Get,
	HttpCode,
	Post,
	UseInterceptors
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AUTH } from 'constants/message.constant';
import { CurrentUser } from 'decorators/current-user.decorator';
import { Message } from 'decorators/response-message.decorator';
import { HidePasswordInterceptor } from 'interceptors/hide-password.interceptor';
import { RequiredPipe } from 'src/pipes/required.pipe';
import {
	ApiForgotPassword,
	ApiGetMe,
	ApiLogin,
	ApiRefreshToken,
	ApiRegister,
	ApiResetPassword
} from './auth.swagger';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { User } from './schemas/user.schema';
import { AuthService } from './services/auth.service';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('register')
	@Message(AUTH.REGISTER)
	@UseInterceptors(HidePasswordInterceptor)
	@ApiRegister()
	register(@Body() body: RegisterDto) {
		return this.authService.register(body);
	}

	@Post('login')
	@HttpCode(200)
	@Message(AUTH.LOGIN)
	@ApiLogin()
	login(@Body() body: LoginDto) {
		return this.authService.login(body);
	}

	@Get('me')
	@Message(AUTH.GET_ME)
	@ApiGetMe()
	getMe(@CurrentUser() user: User) {
		return user;
	}

	@Post('refresh-token')
	@HttpCode(200)
	@Message(AUTH.REFRESH_TOKEN)
	@ApiRefreshToken()
	refreshToken(
		@CurrentUser() user: User,
		@Body('refresh_token', RequiredPipe) refresh_token
	) {
		return this.authService.refresherToken(
			user._id,
			refresh_token.toString()
		);
	}

	@Post('forgot-password')
	@HttpCode(200)
	@ApiForgotPassword()
	forgotPassword(@Body('email', RequiredPipe) email) {
		return this.authService.forgotPassword(email);
	}

	@Post('reset-password')
	@HttpCode(200)
	@Message(AUTH.RESET_PASSWORD)
	@ApiResetPassword()
	resetPassword(@Body() body: ResetPasswordDto) {
		return this.authService.resetPassword(body);
	}
}
