"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderValidations = void 0;
const zod_1 = require("zod");
const createOrderValidationSchema = zod_1.z.object({
    items: zod_1.z.array(zod_1.z.object({
        product: zod_1.z.string(),
        quantity: zod_1.z.number(),
    })),
    status: zod_1.z.string().optional(),
    totalPrice: zod_1.z.number().optional(),
    contact: zod_1.z.number(),
    address: zod_1.z.string(),
    orderNote: zod_1.z.string().optional()
});
exports.orderValidations = {
    createOrderValidationSchema
};
