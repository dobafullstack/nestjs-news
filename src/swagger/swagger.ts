import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Role } from 'auth/schemas/role.schema';
import { User } from 'auth/schemas/user.schema';

export const useSwagger = (app: INestApplication) => {
	const config = new DocumentBuilder()
		.setTitle('News APIs')
		.setDescription('The documentation of news')
		.setVersion('1.0')
		.addBearerAuth()
		.build();

	const document = SwaggerModule.createDocument(app, config, {
		extraModels: [User, Role]
	});

	//Sort method
	SwaggerModule.setup('docs', app, document, {
		swaggerOptions: {
			operationsSorter: (a, b) => {
				var methodsOrder = [
					'get',
					'post',
					'put',
					'patch',
					'delete',
					'options',
					'trace'
				];
				var result =
					methodsOrder.indexOf(a.get('method')) -
					methodsOrder.indexOf(b.get('method'));

				return result;
			}
		}
	});
};
