import { Types } from "mongoose";

export interface IChatRoomParticipant {
    id: string;
    role: 'admin' | 'customer'
    joinedAt: Date;
    lastSeenAt?: Date | null;
    isActive: boolean;
    // Relations
    roomId: string;
    userId: Types.ObjectId;
}