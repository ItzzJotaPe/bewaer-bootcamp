import { z } from "zod";

export const deleteProductVariantSchema = z.object({
  variantId: z.string(),
});

export type DeleteProductVariantInput = z.infer<
  typeof deleteProductVariantSchema
>;
