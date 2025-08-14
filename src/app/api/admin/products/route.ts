import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { categoryTable, productTable, productVariantTable } from "@/db/schema";

export async function GET(request: NextRequest) {
  try {
    const products = await db
      .select({
        id: productTable.id,
        name: productTable.name,
        slug: productTable.slug,
        description: productTable.description,
        imageUrl: productTable.imageUrl,
        createdAt: productTable.createdAt,
        category: {
          id: categoryTable.id,
          name: categoryTable.name,
          slug: categoryTable.slug,
        },
      })
      .from(productTable)
      .leftJoin(categoryTable, eq(productTable.categoryId, categoryTable.id));

    const productsWithVariants = await Promise.all(
      products.map(async (product) => {
        const variants = await db
          .select({
            id: productVariantTable.id,
            name: productVariantTable.name,
            slug: productVariantTable.slug,
            color: productVariantTable.color,
            priceInCents: productVariantTable.priceInCents,
            imageUrl: productVariantTable.imageUrl,
          })
          .from(productVariantTable)
          .where(eq(productVariantTable.productId, product.id));

        return {
          ...product,
          category: product.category || undefined,
          variants,
        };
      }),
    );

    return NextResponse.json(productsWithVariants);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
