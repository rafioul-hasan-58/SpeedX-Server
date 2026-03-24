"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Chatbot = void 0;
const mongoose_1 = require("mongoose");
const messageSchema = new mongoose_1.Schema({
    role: {
        type: String,
        enum: ["user", "assistant"],
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
}, { timestamps: true });
const chatbotSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true,
    },
    messages: [messageSchema],
}, { timestamps: true });
exports.Chatbot = (0, mongoose_1.model)("Chatbot", chatbotSchema);
