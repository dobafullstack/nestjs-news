import {
	CallHandler,
	ExecutionContext,
	Injectable,
	NestInterceptor
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

@Injectable()
export class HidePasswordInterceptor implements NestInterceptor {
	/**
	 * Hide User's password 
	 */
	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		return next.handle().pipe(
			map((data) => ({
				...data._doc,
				password: undefined
			}))
		);
	}
}
