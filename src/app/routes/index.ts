import { Router } from "express";
import { userRoutes } from "../modules/Users/user.route";
import { productRoutes } from "../modules/Products/product.route";
import { orderRoutes } from "../modules/Orders/order.route";

const router = Router()

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
        path:'/orders',
        route:orderRoutes
    }
]

moduleRoutes.forEach((route) => router.use(route.path, route.route))

export default router