import {
	Injectable,
	NestMiddleware,
	UnauthorizedException
} from '@nestjs/common';
import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { UserService } from 'src/app/auth/services/users.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
	constructor(private readonly userService: UserService) {}

	async use(req: Request, res: Response, next: (error?: any) => void) {
		const bearerToken = req.headers['authorization'];

		if (!bearerToken) {
			throw new UnauthorizedException([
				{
					field: 'bearer_token',
					message: 'BEARER_TOKEN_REQUIRED'
				}
			]);
		}

		const token = bearerToken.replace('Bearer ', '');

		if (!token) {
			throw new UnauthorizedException([
				{
					field: 'bearer_token',
					message: 'JWT_MALFORMED'
				}
			]);
		}

		let user_id: string;

		jwt.verify(token, process.env.SECRET_JWT, (err, decode) => {
			if (err) {
				throw new UnauthorizedException([
					{
						field: 'bearer_token',
						message: err.message.toUpperCase()
					}
				]);
			}

			//@ts-ignore
			user_id = decode.user_id;
		});

		//@ts-ignore
		req.user = await this.userService.findOneById(user_id);

		next();
	}
}
