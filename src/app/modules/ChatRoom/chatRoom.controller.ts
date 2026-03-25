import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import { chatRoomService } from "./chatRoom.service";
import sendResponse from "../../utils/sendResponse";

const createOrGetChatRoom = catchAsync(async (req, res) => {
    const result = await chatRoomService.createOrGetChatRoom(
        req.body.createdBy,
        req.body.participantId
    );

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Chat room created successfully",
        data: result,
    });
});

const joinChatRoom = catchAsync(async (req, res) => {
    const result = await chatRoomService.joinChatRoom(
        req.body.roomId,
        req.body.userId
    );

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Joined chat room successfully",
        data: result,
    });
});

export const chatRoomController = {
    createOrGetChatRoom,
    joinChatRoom,
};
