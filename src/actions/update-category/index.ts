"use server";

import { db } from "@/db";
import { categoryTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { UpdateCategoryInput, updateCategorySchema } from "./schema";

export async function updateCategory(input: UpdateCategoryInput) {
  const parsed = updateCategorySchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Invalid payload" } as const;
  }

  const { id, name, slug } = parsed.data;

  try {
    await db
      .update(categoryTable)
      .set({ name, slug })
      .where(eq(categoryTable.id, id));
    return { success: true } as const;
  } catch (error) {
    return { success: false, error: "Failed to update category" } as const;
  }
}
