"use server";

import { db } from "@/db";
import { productVariantTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import {
  UpdateProductVariantInput,
  updateProductVariantSchema,
} from "./schema";

export async function updateProductVariant(input: UpdateProductVariantInput) {
  const parsed = updateProductVariantSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Invalid payload" } as const;
  }

  const { id, name, slug, color, priceInCents, imageUrl } = parsed.data;

  await db
    .update(productVariantTable)
    .set({ name, slug, color, priceInCents, imageUrl })
    .where(eq(productVariantTable.id, id));

  return { success: true } as const;
}
