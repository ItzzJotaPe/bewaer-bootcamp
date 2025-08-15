"use server";

import { db } from "@/db";
import { categoryTable } from "@/db/schema";
import { CreateCategoryInput, createCategorySchema } from "./schema";

export async function createCategory(input: CreateCategoryInput) {
  const parsed = createCategorySchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Invalid payload" } as const;
  }

  const { name, slug } = parsed.data;

  try {
    await db.insert(categoryTable).values({ name, slug });
    return { success: true } as const;
  } catch (error) {
    return { success: false, error: "Failed to create category" } as const;
  }
}
