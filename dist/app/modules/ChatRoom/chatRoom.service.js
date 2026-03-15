"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatRoomService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const chatRoomParticipant_model_1 = require("../ChatRoomParticipant/chatRoomParticipant.model");
const chatRoom_model_1 = require("./chatRoom.model");
const chat_model_1 = require("../Chat/chat.model");
const mongoose_1 = require("mongoose");
const createOrGetChatRoom = (createdBy, participantId) => __awaiter(void 0, void 0, void 0, function* () {
    // Generate consistent room ID (always job-related now)
    const roomId = `chat_${createdBy}_${participantId}`;
    //   check if the chatRoom already exists
    let chatRoom = yield chatRoom_model_1.ChatRoom.findOne({ roomId })
        .populate({
        path: "ChatRoomParticipant",
        populate: {
            path: "user",
            select: "_id name image email role"
        }
    });
    const session = yield chatRoom_model_1.ChatRoom.startSession();
    session.startTransaction();
    if (!chatRoom) {
        try {
            // 1. Create ChatRoom
            const newchatRoom = yield chatRoom_model_1.ChatRoom.create([
                {
                    roomId,
                    createdBy,
                    isActive: true,
                },
            ], { session });
            chatRoom = newchatRoom[0];
            const participants = yield chatRoomParticipant_model_1.ChatRoomParticipant.create([
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
            ], { session });
            // 3. Push participants into ChatRoom
            chatRoom.ChatRoomParticipant = participants;
            yield chatRoom.save({ session });
            console.log("ultimate ChatRoom", chatRoom);
            yield session.commitTransaction();
            session.endSession();
        }
        catch (err) {
            yield session.abortTransaction();
            session.endSession();
            throw err;
        }
    }
    else {
        // Update last activity
        yield chatRoom_model_1.ChatRoom.updateOne({ _id: chatRoom._id }, { lastActivity: new Date() });
    }
    return chatRoom;
});
const joinChatRoom = (roomId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const room = yield chatRoom_model_1.ChatRoom.findOne({ roomId });
    if (!room) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Chat room not found");
    }
    const existingParticipant = yield chatRoomParticipant_model_1.ChatRoomParticipant.findOne({ roomId, userId });
    if (existingParticipant) {
        if (!existingParticipant.isActive) {
            yield chatRoomParticipant_model_1.ChatRoomParticipant.updateOne({ _id: existingParticipant.id }, { isActive: true, joinedAt: new Date() });
        }
        return existingParticipant;
    }
    return yield chatRoomParticipant_model_1.ChatRoomParticipant.create({ roomId, userId, role: "customer" });
});
const getSpecificChatRoomMessages = (roomId_1, userId_1, ...args_1) => __awaiter(void 0, [roomId_1, userId_1, ...args_1], void 0, function* (roomId, userId, page = 1, limit = 1) {
    const participant = yield chatRoomParticipant_model_1.ChatRoomParticipant.findOne({ roomId, userId, });
    if (!participant || !participant.isActive) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, "You are not a participant in this room!!");
    }
    const skip = (page - 1) * limit;
    const messages = yield chat_model_1.Chat.find({ roomId })
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
        .sort({ createdAt: -1 }) // descending order like Prisma
        .skip(skip) // skip for pagination
        .limit(limit);
    return messages;
});
const getUserInbox = (userId) => __awaiter(void 0, void 0, void 0, function* () {
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
    const chatRooms = yield chatRoom_model_1.ChatRoom.find({ isActive: true })
        .populate({
        path: "ChatRoomParticipant",
        match: { userId: new mongoose_1.Types.ObjectId(userId), isActive: true }, // filter participants
        populate: {
            path: "userId", // populate user info
            select: "_id name email image role", // select specific fields
        },
    })
        .populate({
        path: "Chat",
        options: {
            sort: { createdAt: -1 }, // orderBy createdAt desc
            limit: 1, // take 1 (latest message)
        },
        populate: {
            path: "senderId",
            select: "_id name", // select sender fields
        },
    })
        .sort({ lastActivity: -1 });
    const chatRoomsWithReceiver = chatRooms.map((room) => {
        // Find the other participant (receiver) in this chat room
        const receiver = room.ChatRoomParticipant.find((participant) => participant.userId !== userId);
        return Object.assign(Object.assign({}, room), { receiverId: (receiver === null || receiver === void 0 ? void 0 : receiver.userId) || null, receiverName: (receiver === null || receiver === void 0 ? void 0 : receiver.name) || null, receiverEmail: (receiver === null || receiver === void 0 ? void 0 : receiver.email) || null, receiverProfilePic: (receiver === null || receiver === void 0 ? void 0 : receiver.image) || null, receiverRole: (receiver === null || receiver === void 0 ? void 0 : receiver.role) || null });
    });
    return chatRoomsWithReceiver;
});
const updateRoomParticipantLastSeen = (roomId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    yield chatRoomParticipant_model_1.ChatRoomParticipant.updateMany({ roomId, userId, isActive: true }, { lastSeenAt: new Date() });
});
exports.chatRoomService = {
    createOrGetChatRoom,
    joinChatRoom,
    getSpecificChatRoomMessages,
    getUserInbox,
    updateRoomParticipantLastSeen
};
