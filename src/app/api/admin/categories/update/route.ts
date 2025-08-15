import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { categoryTable } from "@/db/schema";

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, slug } = body;

    if (!id || !name || !slug) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    await db
      .update(categoryTable)
      .set({ name, slug })
      .where(eq(categoryTable.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update category" },
      { status: 500 },
    );
  }
}
