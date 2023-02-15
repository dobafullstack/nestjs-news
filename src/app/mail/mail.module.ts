import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { MailService } from './mail.service';

@Global()
@Module({
	imports: [
		MailerModule.forRootAsync({
			inject: [ConfigService],
			useFactory: (configService: ConfigService) => ({
				transport: {
					host: configService.get<string>('SMTP_HOST'),
					secure: false,
					auth: {
						user: configService.get<string>('SMTP_USERNAME'),
						pass: configService.get<string>('SMTP_PASSWORD')
					}
				},
				defaults: {
					from: '"No Reply" <noreply@example.com>'
				},
				template: {
					dir: join(__dirname, 'templates'),
					adapter: new HandlebarsAdapter(),
					options: {
						strict: true
					}
				}
			})
		})
	],
	providers: [MailService],
	exports: [MailService]
})
export class MailModule {}
