import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { productTable } from "@/db/schema";

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, description, slug, categoryId, imageUrl } = body;

    if (!id || !name || !description || !slug || !categoryId) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    await db
      .update(productTable)
      .set({ name, description, slug, categoryId, imageUrl: imageUrl || null })
      .where(eq(productTable.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 },
    );
  }
}
