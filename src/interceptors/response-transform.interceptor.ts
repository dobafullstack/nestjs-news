import {
	CallHandler,
	ExecutionContext,
	Injectable,
	NestInterceptor
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { MESSAGE_KEY } from 'decorators/response-message.decorator';
import { Response } from 'express';
import { map, Observable } from 'rxjs';

@Injectable()
export class ResponseTransformInterceptor implements NestInterceptor {
	constructor(private reflector: Reflector) {}

	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		const message = this.reflector.getAllAndOverride<string>(MESSAGE_KEY, [
			context.getHandler(),
			context.getClass()
		]);

		const code = context.switchToHttp().getResponse<Response>().statusCode;

		return next.handle().pipe(
			map((data) => ({
				code,
				success: true,
				message: message || 'SUCCESS',
				errors: [],
				data
			}))
		);
	}
}
