import {
	BadRequestException,
	ClassSerializerInterceptor,
	INestApplication,
	ValidationError,
	ValidationPipe
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { HttpExceptionFilter } from 'src/filters/http-exception.filter';
import { ResponseTransformInterceptor } from 'src/interceptors/response-transform.interceptor';

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
	app.useGlobalInterceptors(new ResponseTransformInterceptor());
	app.useGlobalFilters(new HttpExceptionFilter());
	app.useGlobalInterceptors(
		new ClassSerializerInterceptor(app.get(Reflector))
	);
};
