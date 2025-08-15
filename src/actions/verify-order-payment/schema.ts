import { z } from "zod";

export const verifyOrderPaymentSchema = z.object({
  orderId: z.string().uuid(),
});

export type VerifyOrderPaymentSchema = z.infer<typeof verifyOrderPaymentSchema>;
