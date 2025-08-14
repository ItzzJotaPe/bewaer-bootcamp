import { z } from "zod";

export const createProductVariantSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  slug: z.string().min(1, "Slug é obrigatório"),
  color: z.string().min(1, "Cor é obrigatória"),
  priceInCents: z.number().min(1, "Preço deve ser maior que zero"),
  imageUrl: z.string().url("URL da imagem deve ser válida"),
  productId: z.string().min(1, "ID do produto é obrigatório"),
});

export type CreateProductVariantInput = z.infer<
  typeof createProductVariantSchema
>;
