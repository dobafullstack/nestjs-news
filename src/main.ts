import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { applyGlobalMiddleware } from './middlewares/app.middleware';
import { useSwagger } from './swagger/swagger';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	applyGlobalMiddleware(app);
	useSwagger(app);

	await app.listen(3000);
}
bootstrap();
