import { Router } from "express";
import { userRoutes } from "../modules/Users/user.route";
import { productRoutes } from "../modules/Products/product.route";
import { orderRoutes } from "../modules/Orders/order.route";
import { authRoutes } from "../modules/Auth/auth.route";
import { chatRoomRoute } from "../modules/ChatRoom/chatRoom.route";
import { ChatRoute } from "../modules/Chat/chat.route";

const router = Router();

const moduleRoutes = [
    {
        path: '/users',
        route: userRoutes
    },
    {
        path: '/products',
        route: productRoutes
    },
    {
        path: '/orders',
        route: orderRoutes
    },
    {
        path: '/auth',
        route: authRoutes
    },
    {
        path: '/chatRooms',
        route: chatRoomRoute
    },
    {
        path: '/chats',
        route: ChatRoute
    }
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;