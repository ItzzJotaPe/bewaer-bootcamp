import { z } from "zod";

export const updateCategorySchema = z.object({
  id: z.string().min(1, "ID é obrigatório"),
  name: z.string().min(1, "Nome é obrigatório"),
  slug: z.string().min(1, "Slug é obrigatório"),
});

export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
