import { z } from "zod";


const createOrderValidationSchema = z.object({
    items: z.array(
        z.object({
            product: z.string(),
            quantity: z.number(),
        })
    ),
    status: z.string().optional(),
    totalPrice: z.number().optional(),
    contact: z.number(),
    address: z.string(),
    orderNote: z.string().optional()
});

export const orderValidations = {
    createOrderValidationSchema
}