import { model, Schema } from "mongoose";

export interface IOTP {
    otpCode: string;
    otpExpiresAt: Date;
    userId: Schema.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const otpSchema = new Schema<IOTP>(
    {
        otpCode: {
            type: String,
            required: true,
        },
        otpExpiresAt: {
            type: Date,
            required: true,
            index: true, // for cleanup of expired OTPs
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true, // one active OTP per user
        },
    },
    {
        timestamps: true,
    }
);

// Ensure unique active OTPs per user
otpSchema.index({ userId: 1, otpCode: 1 }, { unique: true });

export const OTP = model<IOTP>("OTP", otpSchema);