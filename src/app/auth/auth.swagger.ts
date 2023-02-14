import { applyDecorators } from '@nestjs/common';
import {
	ApiCreatedResponse,
	ApiOkResponse,
	getSchemaPath
} from '@nestjs/swagger';
import { ApiConflict, ApiNotFound, ApiUnauthorized } from 'src/swagger/response.swagger';
import { User } from './schemas/user.schema';

export const ApiRegister = () =>
	applyDecorators(
		ApiConflict(),
		ApiCreatedResponse({
			schema: {
				properties: {
					code: { example: 201 },
					success: { example: true },
					message: { example: 'SUCCESS' },
					errors: { example: [] },
					data: { $ref: getSchemaPath(User) }
				}
			}
		})
	);

export const ApiLogin = () =>
	applyDecorators(
		ApiNotFound(),
		ApiOkResponse({
			schema: {
				properties: {
					code: { example: 200 },
					success: { example: true },
					message: { example: 'SUCCESS' },
					errors: { example: [] },
					data: { example: { token: 'string' } }
				}
			}
		})
	);

export const ApiGetMe = () =>
	applyDecorators(
		ApiUnauthorized(),
		ApiOkResponse({
			schema: {
				properties: {
					code: { example: 200 },
					success: { example: true },
					message: { example: 'SUCCESS' },
					errors: { example: [] },
					data: { $ref: getSchemaPath(User) }
				}
			}
		})
	);
