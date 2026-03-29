"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OTP = void 0;
const mongoose_1 = require("mongoose");
const otpSchema = new mongoose_1.Schema({
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
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true, // one active OTP per user
    },
}, {
    timestamps: true,
});
// Ensure unique active OTPs per user
otpSchema.index({ userId: 1, otpCode: 1 }, { unique: true });
exports.OTP = (0, mongoose_1.model)("OTP", otpSchema);
