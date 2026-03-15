"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_route_1 = require("../modules/Users/user.route");
const product_route_1 = require("../modules/Products/product.route");
const order_route_1 = require("../modules/Orders/order.route");
const auth_route_1 = require("../modules/Auth/auth.route");
const chatRoom_route_1 = require("../modules/ChatRoom/chatRoom.route");
const chat_route_1 = require("../modules/Chat/chat.route");
const router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: '/users',
        route: user_route_1.userRoutes
    },
    {
        path: '/products',
        route: product_route_1.productRoutes
    },
    {
        path: '/orders',
        route: order_route_1.orderRoutes
    },
    {
        path: '/auth',
        route: auth_route_1.authRoutes
    },
    {
        path: '/chatRooms',
        route: chatRoom_route_1.chatRoomRoute
    },
    {
        path: '/chats',
        route: chat_route_1.ChatRoute
    }
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
