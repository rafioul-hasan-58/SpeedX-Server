import { Schema, model} from "mongoose";
import { IChat } from "./chat.interface";

const chatSchema = new Schema<IChat>(
  {
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
      type: Schema.Types.ObjectId,
      ref: "Chat",
      default: null,
    },
    roomId: {
      type: Schema.Types.ObjectId,
      ref: "ChatRoom",
      required: true,
    },
    senderId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    replies: [
      {
        type: Schema.Types.ObjectId,
        ref: "Chat",
      },
    ],
  },
  {
    timestamps: true, // createdAt and updatedAt
  }
);

// Indexes for faster queries
chatSchema.index({ roomId: 1 });
chatSchema.index({ senderId: 1 });
chatSchema.index({ createdAt: 1 });

export const Chat = model<IChat>("Chat", chatSchema);
