"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatbotRoutes = void 0;
const express_1 = require("express");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const chatbot_controller_1 = require("./chatbot.controller");
const router = (0, express_1.Router)();
router.post("/chat", (0, auth_1.default)(), chatbot_controller_1.chatbotController.chat);
router.get("/history", (0, auth_1.default)(), chatbot_controller_1.chatbotController.getChatHistory);
router.delete("/clear", (0, auth_1.default)(), chatbot_controller_1.chatbotController.clearChatHistory);
exports.chatbotRoutes = router;
