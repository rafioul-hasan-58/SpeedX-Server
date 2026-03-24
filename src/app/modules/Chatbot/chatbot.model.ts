import { Schema, model } from "mongoose";
import { IChatbot, IMessage } from "./chatbot.interface";

const messageSchema = new Schema<IMessage>(
    {
        role: {
            type: String,
            enum: ["user", "assistant"],
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

const chatbotSchema = new Schema<IChatbot>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
        },
        messages: [messageSchema],
    },
    { timestamps: true }
);

export const Chatbot = model<IChatbot>("Chatbot", chatbotSchema);