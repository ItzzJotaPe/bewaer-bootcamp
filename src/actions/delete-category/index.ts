"use server";

import { db } from "@/db";
import { categoryTable, productTable } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function deleteCategory(id: string) {
  try {
    // Verificar se há produtos usando esta categoria
    const productsInCategory = await db
      .select({ id: productTable.id })
      .from(productTable)
      .where(eq(productTable.categoryId, id))
      .limit(1);

    if (productsInCategory.length > 0) {
      return {
        success: false,
        error: "Não é possível excluir categoria com produtos",
      } as const;
    }

    await db.delete(categoryTable).where(eq(categoryTable.id, id));
    return { success: true } as const;
  } catch (error) {
    return { success: false, error: "Failed to delete category" } as const;
  }
}
