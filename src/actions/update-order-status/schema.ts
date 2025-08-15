import { z } from "zod";

export const updateOrderStatusSchema = z.object({
  orderId: z.string().uuid(),
  status: z.enum(["pending", "paid", "canceled"]),
});

export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
