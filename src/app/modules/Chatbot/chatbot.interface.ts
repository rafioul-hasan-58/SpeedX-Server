import { Document, Types } from "mongoose";

export interface IMessage {
    role: "user" | "assistant";
    content: string;
    createdAt?: Date;
}

export interface IChatbot extends Document {
    userId: Types.ObjectId;
    messages: IMessage[];
    createdAt?: Date;
    updatedAt?: Date;
}