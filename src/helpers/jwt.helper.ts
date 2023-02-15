import { UnauthorizedException } from '@nestjs/common';
import { JWT_EXPIRE } from 'constants/constant';
import * as jwt from 'jsonwebtoken';

export class JwtHelper {
	static sign(payload: any, expiresIn: string | number = JWT_EXPIRE) {
		const accessToken = jwt.sign(payload, process.env.SECRET_JWT, {
			expiresIn
		});

		return {
			accessToken,
			expiresIn
		};
	}

	static verify(token, callback: (decode: jwt.JwtPayload) => void) {
		jwt.verify(token, process.env.SECRET_JWT, (err, decode) => {
			if (err) {
				throw new UnauthorizedException([
					{
						field: 'bearer_token',
						message: err.message.split(' ').join('_').toUpperCase()
					}
				]);
			}

			callback(decode);
		});
	}
}
