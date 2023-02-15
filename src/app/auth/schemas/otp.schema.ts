import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type OtpDocument = HydratedDocument<Otp>;

@Schema()
export class Otp {
	@Prop()
	email: string;

	@Prop()
	code: string;

	@Prop({ type: Date, default: Date.now, expires: '1s' })
	createdAt: Date;
}

export const OtpSchema = SchemaFactory.createForClass(Otp);
