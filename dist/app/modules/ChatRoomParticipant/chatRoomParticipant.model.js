"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatRoomParticipant = void 0;
const mongoose_1 = require("mongoose");
const chatRoomParticipantSchema = new mongoose_1.Schema({
    role: {
        type: String,
        enum: ["admin", "customer"],
        default: "customer",
    },
    joinedAt: {
        type: Date,
        default: Date.now,
    },
    lastSeenAt: {
        type: Date,
        default: null,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    roomId: {
        type: String,
        ref: "ChatRoom",
        required: true,
    },
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
}, {
    timestamps: false, // since you already defined joinedAt, lastSeenAt manually
});
// Unique constraint like Prisma @@unique([roomId, userId])
chatRoomParticipantSchema.index({ roomId: 1, userId: 1 }, { unique: true });
exports.ChatRoomParticipant = (0, mongoose_1.model)("ChatRoomParticipant", chatRoomParticipantSchema);
