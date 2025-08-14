"use server";

import { db } from "@/db";
import { productTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { UpdateProductInput, updateProductSchema } from "./schema";

export async function updateProduct(input: UpdateProductInput) {
  const parsed = updateProductSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Invalid payload" } as const;
  }

  const { id, name, description, slug, categoryId, imageUrl } = parsed.data;

  await db
    .update(productTable)
    .set({ name, description, slug, imageUrl: imageUrl || null, categoryId })
    .where(eq(productTable.id, id));

  return { success: true } as const;
}
