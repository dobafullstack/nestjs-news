import {
	MiddlewareConsumer,
	Module,
	NestModule,
	RequestMethod
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthController } from './app/auth/auth.controller';
import { AuthModule } from './app/auth/auth.module';
import { RoleGuard } from './guards/role.guard';
import { AuthMiddleware } from './middlewares/auth.middleware';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: '.env'
		}),
		MongooseModule.forRootAsync({
			inject: [ConfigService],
			useFactory: (configService: ConfigService) => ({
				uri: configService.get<string>('MONGODB_URL')
			})
		}),
		AuthModule
	],
	providers: [
		{
			provide: APP_GUARD,
			useClass: RoleGuard
		}
	]
})
export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer
			.apply(AuthMiddleware)
			.exclude(
				{
					path: '/auth/register',
					method: RequestMethod.POST
				},
				{
					path: '/auth/login',
					method: RequestMethod.POST
				}
			)
			.forRoutes(AuthController);
	}
}
