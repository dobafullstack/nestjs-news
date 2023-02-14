import {
	ApiConflictResponse,
	ApiNotFoundResponse,
	ApiUnauthorizedResponse
} from '@nestjs/swagger';

export const ApiConflict = () =>
	ApiConflictResponse({
		schema: {
			example: {
				code: 409,
				success: false,
				message: 'Conflict Exception',
				errors: {
					field: 'string',
					message: 'string'
				},
				data: []
			}
		}
	});

export const ApiNotFound = () =>
	ApiNotFoundResponse({
		schema: {
			example: {
				code: 404,
				success: false,
				message: 'Not Found Exception',
				errors: {
					field: 'string',
					message: 'string'
				},
				data: []
			}
		}
	});

export const ApiUnauthorized = () =>
	ApiUnauthorizedResponse({
		schema: {
			example: {
				code: 401,
				success: false,
				message: 'Unauthorized Exception',
				errors: {
					field: 'string',
					message: 'string'
				},
				data: []
			}
		}
	});
