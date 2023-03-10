import {
	Injectable,
	NestMiddleware,
	UnauthorizedException
} from '@nestjs/common';
import { UserService } from 'auth/services/users.service';
import { Request, Response } from 'express';
import { JwtHelper } from 'helpers/jwt.helper';
import * as jwt from 'jsonwebtoken';

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

		JwtHelper.verify(token, (decode) => {
			user_id = decode.user_id;
		});

		req.user = await this.userService.findOneById(user_id);

		next();
	}
}
