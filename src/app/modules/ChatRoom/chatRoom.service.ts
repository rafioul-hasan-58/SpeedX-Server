import status from "http-status";
import AppError from "../../errors/AppError";
import { ChatRoomParticipant } from "../ChatRoomParticipant/chatRoomParticipant.model";
import { ChatRoom } from "./chatRoom.model";
import { Chat } from "../Chat/chat.model";
import { Types } from "mongoose";



const createOrGetChatRoom = async (
    createdBy: string,
    participantId: string
) => {
    // Generate consistent room ID (always job-related now)
    const roomId = `chat_${createdBy}_${participantId}`;
    //   check if the chatRoom already exists

    let chatRoom = await ChatRoom.findOne({ roomId })
        .populate({
            path: "ChatRoomParticipant",
            populate: {
                path: "user",
                select: "_id name image email role"
            }
        });

    const session = await ChatRoom.startSession();
    session.startTransaction();
    if (!chatRoom) {
        try {
            // 1. Create ChatRoom
            const newchatRoom = await ChatRoom.create(
                [
                    {
                        roomId,
                        createdBy,
                        isActive: true,
                    },
                ],
                { session }
            );
            chatRoom = newchatRoom[0];
            const participants = await ChatRoomParticipant.create(
                [
                    {
                        roomId: chatRoom._id,
                        userId: createdBy,
                        role: "admin",
                    },
                    {
                        roomId: chatRoom._id,
                        userId: participantId,
                        role: "customer",
                    },
                ],
                { session }
            );
            // 3. Push participants into ChatRoom
            chatRoom.ChatRoomParticipant = participants;
            await chatRoom.save({ session });
            console.log("ultimate ChatRoom", chatRoom)
            await session.commitTransaction();
            session.endSession();

        } catch (err) {
            await session.abortTransaction();
            session.endSession();
            throw err;
        }
    } else {
        // Update last activity
        await ChatRoom.updateOne({ _id: chatRoom._id }, { lastActivity: new Date() });
    }
    return chatRoom;
};
const joinChatRoom = async (
    roomId: string,
    userId: string
) => {
    const room = await ChatRoom.findOne({ roomId });
    if (!room) {
        throw new AppError(status.NOT_FOUND, "Chat room not found");
    }

    const existingParticipant = await ChatRoomParticipant.findOne({ roomId, userId });

    if (existingParticipant) {
        if (!existingParticipant.isActive) {
            await ChatRoomParticipant.updateOne({ _id: existingParticipant.id }, { isActive: true, joinedAt: new Date() })
        }
        return existingParticipant;
    }

    return await ChatRoomParticipant.create({ roomId, userId, role: "customer" });
};
const getSpecificChatRoomMessages = async (
    roomId: string,
    userId: string,
    page: number = 1,
    limit: number = 1
) => {
    const participant = await ChatRoomParticipant.findOne({ roomId, userId, });

    if (!participant || !participant.isActive) {
        throw new AppError(
            status.FORBIDDEN,
            "You are not a participant in this room!!"
        );
    }

    const skip = (page - 1) * limit;
    const messages = await Chat.find({ roomId })
        .populate({
            path: "senderId",
            select: "_id name email image"
        })
        .populate({
            path: "replyToId",
            populate: {
                path: "senderId",
                select: "_id name email image",
            },
        })
        .sort({ createdAt: -1 })   // descending order like Prisma
        .skip(skip)                // skip for pagination
        .limit(limit);

    return messages;
};
const getUserInbox = async (
    userId: string
) => {
    // const chatRooms = await ChatRoom.find({
    //     where: {
    //         ChatRoomParticipant: {
    //             some: {
    //                 userId,
    //                 isActive: true,
    //             },
    //         },
    //         isActive: true,
    //     },
    //     include: {
    //         ChatRoomParticipant: {
    //             where: { isActive: true },
    //             include: {
    //                 user: {
    //                     select: {
    //                         id: true,
    //                         fullName: true,
    //                         email: true,
    //                         profilePic: true,
    //                         role: true,
    //                     },
    //                 },
    //             },
    //         },
    //         Chat: {
    //             take: 1,
    //             orderBy: { createdAt: "desc" },
    //             include: {
    //                 sender: {
    //                     select: {
    //                         id: true,
    //                         fullName: true,
    //                     },
    //                 },
    //             },
    //         },
    //         _count: {
    //             select: {
    //                 Chat: {
    //                     where: {
    //                         sender: {
    //                             id: { not: userId },
    //                         },
    //                         isRead: false,
    //                     },
    //                 },
    //             },
    //         },
    //     },
    //     orderBy: { lastActivity: "desc" },
    // });

    // Add receiver information to each chat room


    const chatRooms = await ChatRoom.find({ isActive: true })
        .populate({
            path: "ChatRoomParticipant",
            match: { userId: new Types.ObjectId(userId), isActive: true }, // filter participants
            populate: {
                path: "userId", // populate user info
                select: "_id name email image role", // select specific fields
            },
        })
        .populate({
            path: "Chat",
            options: {
                sort: { createdAt: -1 }, // orderBy createdAt desc
                limit: 1,                 // take 1 (latest message)
            },
            populate: {
                path: "senderId",
                select: "_id name",        // select sender fields
            },
        })
        .sort({ lastActivity: -1 });


    const chatRoomsWithReceiver = chatRooms.map((room: any) => {
        // Find the other participant (receiver) in this chat room
        const receiver = room.ChatRoomParticipant.find(
            (participant: any) => participant.userId !== userId
        );
        return {
            ...room,
            receiverId: receiver?.userId || null,
            receiverName: receiver?.name || null,
            receiverEmail: receiver?.email || null,
            receiverProfilePic: receiver?.image || null,
            receiverRole: receiver?.role || null,
        };
    });

    return chatRoomsWithReceiver
};
const updateRoomParticipantLastSeen = async (
    roomId: string,
    userId: string
) => {
    await ChatRoomParticipant.updateMany({ roomId, userId, isActive: true }, { lastSeenAt: new Date() });
};
export const chatRoomService = {
    createOrGetChatRoom,
    joinChatRoom,
    getSpecificChatRoomMessages,
    getUserInbox,
    updateRoomParticipantLastSeen
}