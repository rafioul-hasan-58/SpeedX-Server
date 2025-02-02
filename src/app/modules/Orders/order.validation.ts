import { z } from "zod";


const createOrderValidationSchema = z.object({
    product: z.string(),
    quantity: z.number(),
    status: z.string(),
    totalPrice: z.number(),
    buyer: z.string(),
});

export const orderValidations = {
    createOrderValidationSchema
}