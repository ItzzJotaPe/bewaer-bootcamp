import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

import { db } from "@/db";
import { productTable, productVariantTable } from "@/db/schema";

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId");

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 },
      );
    }

    await db.transaction(async (tx) => {
      await tx
        .delete(productVariantTable)
        .where(eq(productVariantTable.productId, productId));
      await tx.delete(productTable).where(eq(productTable.id, productId));
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 },
    );
  }
}
