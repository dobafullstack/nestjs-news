import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
	constructor(private mailerService: MailerService) {}

	async sendMailForgotPassword(email: string, code: string) {
		

		await this.mailerService.sendMail({
			to: email,
			subject: 'Forgot password',
			template: './forgot-password',
			context: {
				code
			}
		});
	}
}
