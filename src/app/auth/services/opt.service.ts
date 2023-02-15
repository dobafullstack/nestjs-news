import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Otp, OtpDocument } from 'auth/schemas/otp.schema';
import { Model } from 'mongoose';

@Injectable()
export class OtpService {
	constructor(
		@InjectModel(Otp.name) private readonly otpModel: Model<OtpDocument>
	) {}

	/**
	 * Create new OTP
	 * @param email User's email
	 * @param code OTP was sent via email
	 * @returns `Promise<Otp>`
	 */
	async create(email: string, code: string): Promise<Otp> {
		const otp = await this.findOneByEmail(email);

		if (otp) {
			await this.remove(email, otp.code);
		}

		const newOtp = new this.otpModel({ email, code });

		return newOtp.save();
	}

	/**
	 * Remove an OTP
	 * @param email User's email
	 * @param code OTP was sent via email
	 */
	async remove(email: string, code: string) {
		await this.findOneOrFail(code);

		await this.otpModel.deleteOne({ email, code }).exec();
	}

	/**
	 * Get an OTP by user email
	 * @param email User's email
	 * @returns `Promise<Otp>`
	 */
	findOneByEmail(email: string): Promise<Otp> {
		return this.otpModel.findOne({ email }).exec();
	}

	/**
	 * Get an OTP by code. If have no OTP, throw `NotFoundException`
	 * @param code OTP was sent via email
	 * @returns `Promise<Otp>`
	 */
	async findOneOrFail(code: string): Promise<Otp> {
		const otp = await this.otpModel.findOne({ code }).exec();

		if (!otp) {
			throw new NotFoundException([
				{
					field: 'code',
					message: 'OTP not found'
				}
			]);
		}

		return otp;
	}
}
