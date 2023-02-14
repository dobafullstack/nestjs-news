import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import mongoose, { HydratedDocument } from 'mongoose';
import { Role } from './role.schema';

export type UserDocument = HydratedDocument<User>;

@Schema({ versionKey: false })
export class User {
	@ApiProperty({ example: 'string' })
	_id: string;

	@Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Role' })
	@ApiProperty({ type: Role })
	role: Role;

	@Prop({ required: true })
	@ApiProperty()
	name: string;

	@Prop({ required: true })
	@ApiProperty()
	email: string;

	@Prop({ required: true, select: false })
	@Exclude()
	password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
