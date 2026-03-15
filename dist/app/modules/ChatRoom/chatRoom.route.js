"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatRoomRoute = void 0;
const express_1 = require("express");
const chatRoom_controller_1 = require("./chatRoom.controller");
const router = (0, express_1.Router)();
router.post('/create-chatRoom', chatRoom_controller_1.chatRoomController.createOrGetChatRoom);
router.post('/join-chatRoom', chatRoom_controller_1.chatRoomController.joinChatRoom);
exports.chatRoomRoute = router;
