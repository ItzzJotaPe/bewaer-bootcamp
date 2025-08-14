import { db } from "@/db";
import { productTable } from "@/db/schema";

export async function createProduct(data: {
  name: string;
  description: string;
  slug: string;
  imageUrl?: string;
  categoryId: string;
}) {
  try {
    const [product] = await db
      .insert(productTable)
      .values({
        name: data.name,
        description: data.description,
        slug: data.slug,
        imageUrl: data.imageUrl || null,
        categoryId: data.categoryId,
      })
      .returning();

    return { success: true, product };
  } catch (error) {
    return { success: false, error: "Failed to create product" };
  }
}
