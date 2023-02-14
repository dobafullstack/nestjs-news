import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role, RoleDocument } from '../schemas/role.schema';

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
