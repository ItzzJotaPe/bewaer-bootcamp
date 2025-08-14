import { db } from "@/db";
import { productVariantTable } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function deleteProductVariant(variantId: string) {
  try {
    await db
      .delete(productVariantTable)
      .where(eq(productVariantTable.id, variantId));
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to delete product variant" };
  }
}
