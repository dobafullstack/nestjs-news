import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument } from 'mongoose';

export type RoleDocument = HydratedDocument<Role>;

@Schema()
export class Role {
	@ApiProperty({ example: 'string' })
	_id: string;

	@Prop({ required: true })
	@ApiProperty()
	name: string;
}

export const RoleSchema = SchemaFactory.createForClass(Role);
