import { z } from "zod";

export const updateProductSchema = z.object({
  id: z.string().min(1, "ID é obrigatório"),
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string().min(1, "Descrição é obrigatória"),
  slug: z.string().min(1, "Slug é obrigatório"),
  categoryId: z.string().min(1, "Categoria é obrigatória"),
  imageUrl: z.string().url().optional().or(z.literal("")),
});

export type UpdateProductInput = z.infer<typeof updateProductSchema>;
