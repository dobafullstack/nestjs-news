import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { REFRESH_TOKEN_EXPIRE } from 'constants/constant';
import { HydratedDocument } from 'mongoose';

export type TokenDocument = HydratedDocument<Token>;

@Schema()
export class Token {
	@Prop()
	user_id: string;

	@Prop()
	refreshToken: string;

	@Prop()
	expiresIn: string;

	@Prop({type: Date, expires: REFRESH_TOKEN_EXPIRE, default: Date.now })
	createdAt: Date;
}

export const TokenSchema = SchemaFactory.createForClass(Token);
