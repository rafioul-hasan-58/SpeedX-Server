import { Router } from "express";
import auth from "../../middlewares/auth";
import { chatbotController } from "./chatbot.controller";

const router = Router();

router.post(
    "/chat",
    auth(["customer", "admin", "seller"]),
    chatbotController.chat
);

router.get(
    "/history",
    auth(["customer", "admin", "seller"]),
    chatbotController.getChatHistory
);

router.delete(
    "/clear",
    auth(["customer", "admin", "seller"]),
    chatbotController.clearChatHistory
);

export const chatbotRoutes = router;