import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Token, TokenDocument } from '../schemas/token.schema';
import * as jwt from 'jsonwebtoken';
import { REFRESH_TOKEN_EXPIRE } from 'src/constants/constant';

@Injectable()
export class TokenService {
	constructor(
		@InjectModel(Token.name)
		private readonly tokenModel: Model<TokenDocument>
	) {}

	/**
	 * Create new refresh token
	 * @param user_id User's id
	 * @returns `Promise<Token>`
	 */
	async findOneOrCreate(user_id: string): Promise<Token> {
		const token = await this.findOneByUserId(user_id);

		if (!token) {
			const refreshToken = jwt.sign({ user_id }, process.env.SECRET_JWT, {
				expiresIn: REFRESH_TOKEN_EXPIRE
			});

			const newToken = new this.tokenModel({
				user_id,
				refreshToken,
				expiresIn: REFRESH_TOKEN_EXPIRE
			});

			return newToken.save();
		}

		return token;
	}

	/**
	 * Get a token by user id
	 * @param user_id User's id
	 * @returns `Promise<Token>`
	 */
	findOneByUserId(user_id: string): Promise<Token> {
		return this.tokenModel.findOne({ user_id }).exec();
	}
}
