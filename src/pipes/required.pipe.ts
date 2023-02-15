import {
	PipeTransform,
	Injectable,
	ArgumentMetadata,
	BadRequestException
} from '@nestjs/common';

@Injectable()
export class RequiredPipe implements PipeTransform {
	transform(value: any, { data }: ArgumentMetadata) {
		if (value === undefined) {
			throw new BadRequestException([
				{
					field: data,
					message: `${data} is required`
				}
			]);
		}

		return value;
	}
}
