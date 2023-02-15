import { User } from 'auth/schemas/user.schema';
import * as jwt from 'jsonwebtoken';

declare global {
	namespace NodeJS {
		interface ProcessEnv {
			PORT: string;
			MONGODB_URL: string;
			SECRET_JWT: string;

			SMTP_HOST: string;
			SMTP_USERNAME: string;
			SMTP_PASSWORD: string;
		}
	}

	namespace Express {
		export interface Request {
			user?: User;
		}
	}
}

declare module 'jsonwebtoken' {
	export interface JwtPayload extends jwt.JwtPayload {
		user_id?: string;
	}
}

export {};
