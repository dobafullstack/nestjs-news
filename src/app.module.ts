import {
	MiddlewareConsumer,
	Module,
	NestModule,
	RequestMethod
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthController } from './app/auth/auth.controller';
import { AuthModule } from './app/auth/auth.module';
import { RoleGuard } from './guards/role.guard';
import { AuthMiddleware } from './middlewares/auth.middleware';
import { MailModule } from './app/mail/mail.module';
import { ResponseTransformInterceptor } from 'src/interceptors/response-transform.interceptor';

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
		AuthModule,
		MailModule
	],
	providers: [
		{
			provide: APP_GUARD,
			useClass: RoleGuard
		},
		{
			provide: APP_INTERCEPTOR,
			useClass: ResponseTransformInterceptor
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
				},
				{
					path: '/auth/forgot-password',
					method: RequestMethod.POST
				},
				{
					path: '/auth/reset-password',
					method: RequestMethod.POST
				}
			)
			.forRoutes(AuthController);
	}
}
