"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Chat = void 0;
const mongoose_1 = require("mongoose");
const chatSchema = new mongoose_1.Schema({
    message: {
        type: String,
        required: true,
    },
    messageType: {
        type: String,
        enum: ["TEXT", "IMAGE", "FILE", "SYSTEM", "NOTIFICATION"],
        default: "TEXT",
    },
    isRead: {
        type: Boolean,
        default: false,
    },
    isEdited: {
        type: Boolean,
        default: false,
    },
    editedAt: {
        type: Date,
        default: null,
    },
    replyToId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Chat",
        default: null,
    },
    roomId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "ChatRoom",
        required: true,
    },
    senderId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    replies: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "Chat",
        },
    ],
}, {
    timestamps: true, // createdAt and updatedAt
});
// Indexes for faster queries
chatSchema.index({ roomId: 1 });
chatSchema.index({ senderId: 1 });
chatSchema.index({ createdAt: 1 });
exports.Chat = (0, mongoose_1.model)("Chat", chatSchema);
