import { z } from "zod";

export const deleteProductSchema = z.object({
  productId: z.string(),
});

export type DeleteProductInput = z.infer<typeof deleteProductSchema>;
