import { db } from "@/db";
import { productVariantTable } from "@/db/schema";

export async function createProductVariant(data: {
  name: string;
  slug: string;
  color: string;
  priceInCents: number;
  imageUrl: string;
  productId: string;
}) {
  try {
    const [variant] = await db
      .insert(productVariantTable)
      .values({
        name: data.name,
        slug: data.slug,
        color: data.color,
        priceInCents: data.priceInCents,
        imageUrl: data.imageUrl,
        productId: data.productId,
      })
      .returning();

    return { success: true, variant };
  } catch (error) {
    return { success: false, error: "Failed to create product variant" };
  }
}
