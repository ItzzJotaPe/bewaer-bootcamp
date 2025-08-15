import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { categoryTable, productTable } from "@/db/schema";

export async function GET() {
  try {
    const categories = await db
      .select({
        id: categoryTable.id,
        name: categoryTable.name,
        slug: categoryTable.slug,
        createdAt: categoryTable.createdAt,
      })
      .from(categoryTable);

    const categoriesWithCount = await Promise.all(
      categories.map(async (category) => {
        const productCountResult = await db
          .select({ count: productTable.id })
          .from(productTable)
          .where(eq(productTable.categoryId, category.id));

        return {
          ...category,
          productCount: productCountResult.length,
        };
      }),
    );

    return NextResponse.json(categoriesWithCount);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
