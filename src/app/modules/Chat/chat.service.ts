import status from "http-status";
import AppError from "../../errors/AppError";
import { ICreateChatPayload } from "./chat.interface";
import { chatRoomService } from "../ChatRoom/chatRoom.service";
import { User } from "../Users/user.model";
import { Chat } from "./chat.model";

const createChatIntoDB = async (
    email: string,
    payload: ICreateChatPayload
) => {
    const sender = await User.findOne({ email });
    const senderId = sender?._id;
    if (!sender) {
        throw new AppError(status.NOT_FOUND, "Receiver not found");
    } const { receiverId, message } = payload;
    // Check if receiver exists
    const receiver = await User.findById(receiverId);

    if (!receiver) {
        throw new AppError(status.NOT_FOUND, "Receiver not found");
    }

    // Create or get chat room
    const chatRoom = await chatRoomService.createOrGetChatRoom(
        senderId,
        receiverId,
    );

    let chat = await Chat.create({
        roomId: chatRoom._id,
        senderId,
        message,
        messageType: "TEXT"
    })

    chat = await chat.populate({
        path: "senderId",
        select: "_id firstName lastName fullName email profilePic role",
    })

    chat = await chat.populate({
        path: "roomId",
        populate: {
            path: "ChatRoomParticipant",
            populate: {
                path: "userId",
                select: "_id firstName lastName fullName email profilePic role",
            },
        },
    })
    return chat;
};

export const ChatService = {
    createChatIntoDB
}