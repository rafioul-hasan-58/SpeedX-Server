import { model, Schema} from "mongoose";
import { IChatRoom } from "./chatRoom.interface";


const chatRoomSchema = new Schema<IChatRoom>(
  {
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
      type: Schema.Types.ObjectId,
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
        type: Schema.Types.ObjectId,
        ref: "ChatRoomParticipant",
      },
    ],
    Chat: [
      {
        type: Schema.Types.ObjectId,
        ref: "Chat",
      },
    ],
  },
  {
    timestamps: { createdAt: true, updatedAt: true },
  }
);

// Indexes for better query performance
chatRoomSchema.index({ createdBy: 1 });

export const ChatRoom = model<IChatRoom>("ChatRoom", chatRoomSchema);
