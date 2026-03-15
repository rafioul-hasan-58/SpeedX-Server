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
exports.chatRoomController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const http_status_1 = __importDefault(require("http-status"));
const chatRoom_service_1 = require("./chatRoom.service");
const createOrGetChatRoom = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield chatRoom_service_1.chatRoomService.createOrGetChatRoom(req.body.createdBy, req.body.participantId);
    res.status(http_status_1.default.OK).json({
        success: true,
        statusCode: 200,
        message: "ChatRoom created successful!!",
        data: result
    });
}));
const joinChatRoom = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield chatRoom_service_1.chatRoomService.joinChatRoom(req.body.roomId, req.body.userId);
    res.status(http_status_1.default.OK).json({
        success: true,
        statusCode: 200,
        message: "ChatRoom joined successfully!!",
        data: result
    });
}));
exports.chatRoomController = {
    createOrGetChatRoom,
    joinChatRoom
};
