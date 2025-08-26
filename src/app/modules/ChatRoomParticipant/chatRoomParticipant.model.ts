import { Schema, model } from "mongoose";
import { IChatRoomParticipant } from "./chatRoomParticipant.interface";

const chatRoomParticipantSchema = new Schema<IChatRoomParticipant>(
  {
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
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: false, // since you already defined joinedAt, lastSeenAt manually
  }
);

// Unique constraint like Prisma @@unique([roomId, userId])
chatRoomParticipantSchema.index({ roomId: 1, userId: 1 }, { unique: true });

export const ChatRoomParticipant = model<IChatRoomParticipant>(
  "ChatRoomParticipant",
  chatRoomParticipantSchema
);
