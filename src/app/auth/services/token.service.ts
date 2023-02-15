import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Token, TokenDocument } from 'auth/schemas/token.schema';
import { JwtHelper } from 'helpers/jwt.helper';
import { Model } from 'mongoose';
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
			const { accessToken, expiresIn } = JwtHelper.sign(
				{ user_id },
				REFRESH_TOKEN_EXPIRE
			);

			const newToken = new this.tokenModel({
				user_id,
				refreshToken: accessToken,
				expiresIn
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

	/**
	 * Get a token by user id and refreshToken
	 * @param user_id User's id
	 * @param refreshToken Refresh Token
	 * @returns `Promise<Token>`
	 */
	async findOneOrFailByUserIdAndToken(
		user_id: string,
		refreshToken: string
	): Promise<Token> {
		const token = await this.tokenModel
			.findOne({ user_id, refreshToken })
			.exec();

		if (!token) {
			throw new NotFoundException([
				{
					field: 'refresh_token',
					message: 'Refresh Token not found'
				}
			]);
		}

		return token;
	}
}
