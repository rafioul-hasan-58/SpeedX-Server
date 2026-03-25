import { Router } from "express";
import { ChatController } from "./chat.controller";
import auth from "../../middlewares/auth";

const router = Router();




router.post(
    "/create-chat",
    auth(),
    ChatController.createChatIntoDB
);



export const ChatRoute = router;