import catchAsync from "../../utils/catchAsync";
import httpStatus from "http-status";
import { chatRoomService } from "./chatRoom.service";



const createOrGetChatRoom = catchAsync(async (req, res) => {
    const result = await chatRoomService.createOrGetChatRoom(req.body.createdBy, req.body.participantId);
    res.status(httpStatus.OK).json({
        success: true,
        statusCode: 200,
        message: "ChatRoom created successful!!",
        data: result
    })
});
const joinChatRoom = catchAsync(async (req, res) => {
    const result = await chatRoomService.joinChatRoom(req.body.roomId,req.body.userId);
    res.status(httpStatus.OK).json({
        success: true,
        statusCode: 200,
        message: "ChatRoom joined successfully!!",
        data: result
    })
});


export const chatRoomController = {
    createOrGetChatRoom,
    joinChatRoom
}