import { Types } from "mongoose";



export interface IChat {
    message: string;
    messageType: "TEXT" | "IMAGE" | "FILE" | "SYSTEM" | "NOTIFICATION"
    isRead: boolean;
    isEdited: boolean;
    editedAt?: Date | null;
    replyToId?: string | null;
    createdAt: Date;
    updatedAt: Date;
    // Relations
    roomId: Types.ObjectId;
    senderId: Types.ObjectId;
    replyTo?: IChat | null;
    replies: IChat[];
}
export interface ICreateChatPayload {
  receiverId: string;
  message: string;
}

export interface IChatFilters {
  receiverId?: string;
}

export interface IChatQueryParams extends Record<string, unknown> {
  page?: number;
  limit?: number;
  receiverId?: string;
}