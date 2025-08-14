import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { productVariantTable } from "@/db/schema";

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, slug, color, priceInCents, imageUrl } = body;

    if (!id || !name || !slug || !color || !priceInCents || !imageUrl) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    await db
      .update(productVariantTable)
      .set({ name, slug, color, priceInCents, imageUrl })
      .where(eq(productVariantTable.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update product variant" },
      { status: 500 },
    );
  }
}
