import { z } from "zod";

export const updateProductVariantSchema = z.object({
  id: z.string().min(1, "ID é obrigatório"),
  name: z.string().min(1, "Nome é obrigatório"),
  slug: z.string().min(1, "Slug é obrigatório"),
  color: z.string().min(1, "Cor é obrigatória"),
  priceInCents: z.number().min(1, "Preço deve ser maior que zero"),
  imageUrl: z.string().url("URL inválida"),
});

export type UpdateProductVariantInput = z.infer<
  typeof updateProductVariantSchema
>;
