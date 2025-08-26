import { Router } from "express";
import { chatRoomController } from "./chatRoom.controller";

const router = Router();




router.post(
    '/create-chatRoom',
    chatRoomController.createOrGetChatRoom
);
router.post(
    '/join-chatRoom',
    chatRoomController.joinChatRoom
);

export const chatRoomRoute = router;