"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatRoom = void 0;
const mongoose_1 = require("mongoose");
const chatRoomSchema = new mongoose_1.Schema({
    roomId: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        default: null,
    },
    description: {
        type: String,
        default: null,
    },
    createdBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    lastActivity: {
        type: Date,
        default: Date.now,
    },
    ChatRoomParticipant: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "ChatRoomParticipant",
        },
    ],
    Chat: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "Chat",
        },
    ],
}, {
    timestamps: { createdAt: true, updatedAt: true },
});
// Indexes for better query performance
chatRoomSchema.index({ createdBy: 1 });
exports.ChatRoom = (0, mongoose_1.model)("ChatRoom", chatRoomSchema);
