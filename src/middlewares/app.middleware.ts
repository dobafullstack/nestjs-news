import {
	BadRequestException,
	INestApplication,
	ValidationError,
	ValidationPipe
} from '@nestjs/common';
import { HttpExceptionFilter } from 'filters/http-exception.filter';

const exceptionFactory = (errors: ValidationError[]) => {
	throw new BadRequestException(
		errors.map((error) => ({
			field: error.property,
			message: Object.values(error.constraints)[0]
		}))
	);
};

export const applyGlobalMiddleware = (app: INestApplication) => {
	app.setGlobalPrefix('api');
	app.useGlobalPipes(new ValidationPipe({ exceptionFactory }));
	app.useGlobalFilters(new HttpExceptionFilter());
};
