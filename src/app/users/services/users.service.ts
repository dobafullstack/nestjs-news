import { Injectable } from '@nestjs/common';
import { RegisterDto } from '../dto/register.dto';

@Injectable()
export class UserService {
	create(input: RegisterDto) {
		return 'This action adds a new user';
	}

	find() {
		return `This action returns all users`;
	}

	findOne(id: number) {
		return `This action returns a #${id} user`;
	}

	findOneOrFail(id: number) {
		return `This action returns a #${id} user`;
	}
}
