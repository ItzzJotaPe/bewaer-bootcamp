import { z } from "better-auth";

export const addProductToCartSchema = z.object({
  productVarientId: z.string().uuid(),
  quantity: z.number().min(1),
});

export type AddProductToCartSchema = z.infer<typeof addProductToCartSchema>;
