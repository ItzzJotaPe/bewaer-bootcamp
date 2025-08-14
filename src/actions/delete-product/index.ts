import { eq } from "drizzle-orm";

import { db } from "@/db";
import { productTable, productVariantTable } from "@/db/schema";

export async function deleteProduct(productId: string) {
  try {
    await db.transaction(async (tx) => {
      await tx
        .delete(productVariantTable)
        .where(eq(productVariantTable.productId, productId));
      await tx.delete(productTable).where(eq(productTable.id, productId));
    });

    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to delete product" };
  }
}
