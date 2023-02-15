import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Role, RoleDocument } from 'auth/schemas/role.schema';
import { Model } from 'mongoose';

@Injectable()
export class RoleService {
	constructor(
		@InjectModel(Role.name) private readonly roleModel: Model<RoleDocument>
	) {}

	/**
	 * Get a role by name
	 * @param name Role's name
	 * @returns `Promise<Role>`
	 */
	findOneByName(name: string): Promise<Role> {
		return this.roleModel.findOne({ name }).exec();
	}
}
