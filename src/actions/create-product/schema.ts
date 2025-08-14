import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string().min(1, "Descrição é obrigatória"),
  slug: z.string().min(1, "Slug é obrigatório"),
  imageUrl: z.string().optional(),
  categoryId: z.string().min(1, "Categoria é obrigatória"),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
