import status from "http-status";
import { mailService } from "../mail/mail.service";
import AppError from "../errors/AppError";
import { OTP } from "../modules/Auth/otp.schema";
import { User } from "../modules/Users/user.model";

const generateOTP = (): number => Math.floor(100000 + Math.random() * 900000);

export const sendOTP = async (userId: string) => {
    // Step 1: Generate OTP and expiry time
    const otpCode = generateOTP().toString();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 min expiry

    // Step 2: Upsert OTP (findOneAndUpdate with upsert mirrors Prisma's upsert)
    await OTP.findOneAndUpdate(
        { userId },
        {
            otpCode,
            otpExpiresAt,
        },
        {
            upsert: true,   // create if not exists
            new: true,
        }
    );

    // Step 3: Fetch user
    const user = await User.findById(userId).select("email");

    if (!user) {
        throw new AppError(status.NOT_FOUND, "User not found while sending OTP!");
    }

    // Step 4: Send OTP via email
    await mailService.sendEmail(user.email, otpCode, "Verify Your OTP within 10 Minutes");

    return {
        message: "OTP sent successfully",
        expiresAt: otpExpiresAt,
    };
};