import {
	ConflictException,
	Injectable,
	UnauthorizedException
} from '@nestjs/common';
import * as argon2 from 'argon2';
import { LoginDto } from 'auth/dto/login.dto';
import { RegisterDto } from 'auth/dto/register.dto';
import { ResetPasswordDto } from 'auth/dto/reset-password.dto';
import { User } from 'auth/schemas/user.schema';
import { generateString } from 'helpers/generate-code.helper';
import { JwtHelper } from 'helpers/jwt.helper';
import { MailService } from 'mail/mail.service';
import { OtpService } from './opt.service';
import { TokenService } from './token.service';
import { UserService } from './users.service';

@Injectable()
export class AuthService {
	constructor(
		private readonly userService: UserService,
		private readonly tokenService: TokenService,
		private readonly mailService: MailService,
		private readonly otpService: OtpService
	) {}

	/**
	 * Register new user
	 * @param input RegisterDto { name, email, password }
	 * @returns `Promise<User>`
	 */
	async register(input: RegisterDto): Promise<User> {
		const { name, email, password } = input;

		const existingUser = await this.userService.findOneByEmail(email);

		if (existingUser) {
			throw new ConflictException([
				{
					field: 'email',
					message: 'EMAIL_EXIST'
				}
			]);
		}

		const hashedPassword = await argon2.hash(password);

		return this.userService.create({
			name,
			email,
			password: hashedPassword
		});
	}

	/**
	 * Login to system
	 * @param input LoginDto { email, password }
	 * @returns `Promise<{ token, refreshToken }>`
	 */
	async login(input: LoginDto) {
		const { email, password, remember_me } = input;

		const user = await this.userService.findOneOrFailByEmail(email);

		const comparePassword = await argon2.verify(user.password, password);

		if (!comparePassword) {
			throw new UnauthorizedException([
				{
					field: 'password',
					message: 'Invalid password'
				}
			]);
		}

		const { accessToken, expiresIn } = JwtHelper.sign({
			user_id: user._id
		});

		if (remember_me) {
			const { refreshToken } = await this.tokenService.findOneOrCreate(
				user._id
			);

			return {
				accessToken,
				refreshToken,
				expiresIn
			};
		}

		return {
			accessToken,
			expiresIn
		};
	}

	/**
	 * Refresh access token
	 * @returns `Promise<{ accessToken, expiresIn }>`
	 */
	async refresherToken(user_id: string, refreshToken: string) {
		const token = await this.tokenService.findOneOrFailByUserIdAndToken(
			user_id,
			refreshToken
		);

		return new Promise<{
			accessToken: string;
			expiresIn: number;
		}>((resolve) => {
			JwtHelper.verify(token.refreshToken, (decode) => {
				const { accessToken, expiresIn } = JwtHelper.sign({
					user_id: decode.user_id
				});

				resolve({
					accessToken,
					expiresIn: expiresIn as number
				});
			});
		});
	}

	/**
	 * Send an email include OTP code
	 * @param email User's email
	 */
	async forgotPassword(email: string) {
		const code = generateString();

		await this.userService.findOneOrFailByEmail(email);

		await this.otpService.create(email, code);

		await this.mailService.sendMailForgotPassword(email, code);
	}

	/**
	 * Reset password by code was sent via email
	 * @param body ResetPasswordDto { code, password }
	 */
	async resetPassword(body: ResetPasswordDto) {
		const { code, password } = body;

		const { email } = await this.otpService.findOneOrFail(code);

		const hashedPassword = await argon2.hash(password);

		await this.userService.updatePassword(email, hashedPassword);

		await this.otpService.remove(email, code);
	}
}
