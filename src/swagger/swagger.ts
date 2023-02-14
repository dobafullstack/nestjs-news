import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Role } from 'src/app/auth/schemas/role.schema';
import { User } from 'src/app/auth/schemas/user.schema';

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

	SwaggerModule.setup('docs', app, document);
};
