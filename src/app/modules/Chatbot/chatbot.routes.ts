import { Router } from "express";
import auth from "../../middlewares/auth";
import { chatbotController } from "./chatbot.controller";

const router = Router();

router.post(
    "/chat",
    auth(),
    chatbotController.chat
);

router.get(
    "/history",
    auth(),
    chatbotController.getChatHistory
);

router.delete(
    "/clear",
    auth(),
    chatbotController.clearChatHistory
);

export const chatbotRoutes = router;