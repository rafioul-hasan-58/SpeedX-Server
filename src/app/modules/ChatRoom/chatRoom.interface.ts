import { Types } from "mongoose";
import { IChat } from "../Chat/chat.interface";
import {IChatRoomParticipant } from "../ChatRoomParticipant/chatRoomParticipant.interface";

export interface ICreateChatRoomPayload {
    participantId: string;
    name?: string;
    description?: string;
}

export interface IChatRoomFilters {
    roomType?: string;
    isActive?: boolean;
}

export interface IChatRoomQueryParams extends Record<string, unknown> {
    page?: number;
    limit?: number;
    roomType?: string;
    isActive?: boolean;
}

export interface ICreateChatMessagePayload {
    message: string;
    messageType?: "TEXT" | "IMAGE" | "FILE" | "SYSTEM" | "NOTIFICATION";
    replyToId?: string;
}

export interface IChatRoomWithReceiver {
    id: string;
    roomId: string;
    roomType: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    lastActivity: Date | null;
    receiverId: string | null;
    receiverName: string | null;
    receiverEmail: string | null;
    receiverProfilePic: string | null;
    receiverRole: any;
    participants: any[];
    messages: any[];
    _count: {
        messages: number;
    };
}


export interface IChatRoom {
    roomId: string;
    name?: string | null;
    description?: string | null;
    isActive: boolean;
    lastActivity: Date;
    // relations
    createdBy: Types.ObjectId;
    ChatRoomParticipant: IChatRoomParticipant[];
    Chat: IChat[];
}
