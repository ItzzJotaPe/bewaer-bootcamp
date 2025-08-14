import { NextRequest, NextResponse } from "next/server";

import { db } from "@/db";
import { productVariantTable } from "@/db/schema";
import * as schema from "@/db/schema";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, slug, color, priceInCents, imageUrl, productId } = body;

    if (!name || !slug || !color || !priceInCents || !imageUrl || !productId) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 },
      );
    }

    const [variant] = await db
      .insert(productVariantTable)
      .values({
        name,
        slug,
        color,
        priceInCents,
        imageUrl,
        productId,
      })
      .returning();

    return NextResponse.json({ success: true, variant });
  } catch (error) {
    console.error("Error creating product variant:", error);
    return NextResponse.json(
      { error: "Failed to create product variant" },
      { status: 500 },
    );
  }
}
