import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthController } from './auth.controller';
import { Otp, OtpSchema } from './schemas/otp.schema';
import { Role, RoleSchema } from './schemas/role.schema';
import { Token, TokenSchema } from './schemas/token.schema';
import { User, UserSchema } from './schemas/user.schema';
import { AuthService } from './services/auth.service';
import { OtpService } from './services/opt.service';
import { RoleService } from './services/role.service';
import { TokenService } from './services/token.service';
import { UserService } from './services/users.service';

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: User.name, schema: UserSchema },
			{ name: Role.name, schema: RoleSchema },
			{ name: Token.name, schema: TokenSchema },
			{ name: Otp.name, schema: OtpSchema }
		])
	],
	controllers: [AuthController],
	providers: [
		AuthService,
		UserService,
		RoleService,
		TokenService,
		OtpService
	],
	exports: [UserService]
})
export class AuthModule {}
