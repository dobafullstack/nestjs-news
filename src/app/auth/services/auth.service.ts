import {
	ConflictException,
	Injectable,
	UnauthorizedException
} from '@nestjs/common';
import * as argon2 from 'argon2';
import * as jwt from 'jsonwebtoken';
import { JWT_EXPIRE } from '../../../constants/constant';
import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';
import { User } from '../schemas/user.schema';
import { TokenService } from './token.service';
import { UserService } from './users.service';

@Injectable()
export class AuthService {
	constructor(
		private readonly userService: UserService,
		private readonly tokenService: TokenService
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

		const accessToken = jwt.sign(
			{ user_id: user._id },
			process.env.SECRET_JWT,
			{
				expiresIn: JWT_EXPIRE
			}
		);

		if (remember_me) {
			const { refreshToken } = await this.tokenService.findOneOrCreate(
				user._id
			);

			return {
				accessToken,
				refreshToken,
				expiresIn: JWT_EXPIRE
			};
		}

		return {
			accessToken,
			expiresIn: JWT_EXPIRE
		};
	}
}
