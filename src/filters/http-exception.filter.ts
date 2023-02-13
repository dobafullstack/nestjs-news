import {
	ArgumentsHost,
	Catch,
	ExceptionFilter,
	HttpException
} from '@nestjs/common';
import { Response } from 'express';

interface ExceptionResponse {
	statusCode: number;
	message: {
		field: string;
		message: string;
	}[];
	error: string;
}

@Catch(HttpException)
export class HttpExceptionFilter<T> implements ExceptionFilter {
	catch(exception: HttpException, host: ArgumentsHost) {
		const response = host.switchToHttp().getResponse<Response>();

		const statusCode = exception.getStatus();
		const message = exception.message;
		const exceptionResponse = exception.getResponse() as ExceptionResponse;

		return response.status(statusCode).json({
			code: statusCode,
			success: false,
			message,
			errors: exceptionResponse.message,
			data: []
		});
	}
}
