import status from "http-status";
import catchAsync from "../../utils/catchAsync";
import { ChatService } from "./chat.service";



const createChatIntoDB = catchAsync(async (req, res) => {
    const { email } = req.user;
    console.log(req.user)
    const result = await ChatService.createChatIntoDB(email, req.body)
    res.status(status.OK).json({
        success: true,
        statusCode: 200,
        message: "Chat sent successful!!",
        data: result
    })
});


export const ChatController = {
    createChatIntoDB
}