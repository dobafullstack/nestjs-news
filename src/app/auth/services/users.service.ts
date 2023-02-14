import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RegisterDto } from '../dto/register.dto';
import { User, UserDocument } from '../schemas/user.schema';
import { RoleService } from './role.service';

@Injectable()
export class UserService {
	constructor(
		@InjectModel(User.name) private userModel: Model<UserDocument>,
		private readonly roleService: RoleService
	) {}

	/**
	 * Create new User (Author)
	 * @param input `RegisterDto` { name, email, password }
	 * @returns `Promise<User>`
	 */
	async create(input: RegisterDto): Promise<User> {
		const role = await this.roleService.findOneByName('author');

		const newUser = new this.userModel({
			...input,
			role
		});

		return newUser.save();
	}

	/**
	 * Get an user by email
	 * @param email User's email
	 * @returns `Promise<User>`
	 */
	findOneByEmail(email: string): Promise<User> {
		return this.userModel.findOne({ email }).exec();
	}

	/**
	 * Get an user by id
	 * @param id User's id
	 * @returns `Promise<User>`
	 */
	findOneById(id: string): Promise<User> {
		return this.userModel.findById(id).populate('role').exec();
	}

	/**
	 * Get an user by email. If user not found, throw a `NotFoundException`
	 * @param email User's email
	 * @returns `Promise<User>`
	 */
	async findOneOrFailByEmail(email: string): Promise<User> {
		const user = await this.userModel
			.findOne({ email })
			.select('+password')
			.exec();

		if (!user) {
			throw new NotFoundException([
				{
					field: 'email',
					message: 'USER_NOT_FOUND'
				}
			]);
		}

		return user;
	}
}
