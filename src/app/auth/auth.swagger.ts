import { applyDecorators } from '@nestjs/common';
import {
	ApiBearerAuth,
	ApiBody,
	ApiCreatedResponse,
	ApiOkResponse,
	getSchemaPath
} from '@nestjs/swagger';
import { AUTH } from 'constants/message.constant';
import {
	ApiConflict,
	ApiNotFound,
	ApiUnauthorized
} from 'swagger/response.swagger';
import { User } from './schemas/user.schema';

export const ApiRegister = () =>
	applyDecorators(
		ApiConflict(),
		ApiCreatedResponse({
			schema: {
				properties: {
					code: { example: 201 },
					success: { example: true },
					message: { example: AUTH.REGISTER },
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
					message: { example: AUTH.LOGIN },
					errors: { example: [] },
					data: {
						example: {
							accessToken: 'string',
							refreshToken: 'string',
							expiresIn: 0
						}
					}
				}
			}
		})
	);

export const ApiGetMe = () =>
	applyDecorators(
		ApiBearerAuth(),
		ApiUnauthorized(),
		ApiOkResponse({
			schema: {
				properties: {
					code: { example: 200 },
					success: { example: true },
					message: { example: AUTH.GET_ME },
					errors: { example: [] },
					data: { $ref: getSchemaPath(User) }
				}
			}
		})
	);

export const ApiRefreshToken = () =>
	applyDecorators(
		ApiBearerAuth(),
		ApiUnauthorized(),
		ApiBody({
			schema: {
				example: {
					refresh_token: 'string'
				}
			}
		}),
		ApiOkResponse({
			schema: {
				properties: {
					code: { example: 200 },
					success: { example: true },
					message: { example: AUTH.REFRESH_TOKEN },
					errors: { example: [] },
					data: {
						example: {
							accessToken: 'string',
							expiresIn: 0
						}
					}
				}
			}
		})
	);

export const ApiForgotPassword = () =>
	applyDecorators(
		ApiBody({
			schema: {
				example: {
					email: 'string'
				}
			}
		}),
		ApiNotFound(),
		ApiOkResponse({
			schema: {
				properties: {
					code: { example: 200 },
					success: { example: true },
					message: { example: 'SUCCESS' },
					errors: { example: [] }
				}
			}
		})
	);

export const ApiResetPassword = () =>
	applyDecorators(
		ApiNotFound(),
		ApiOkResponse({
			schema: {
				properties: {
					code: { example: 200 },
					success: { example: true },
					message: { example: AUTH.RESET_PASSWORD },
					errors: { example: [] }
				}
			}
		})
	);
