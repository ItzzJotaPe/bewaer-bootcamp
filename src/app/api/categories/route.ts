import { NextResponse } from "next/server";

import { db } from "@/db";
import { categoryTable } from "@/db/schema";

export async function GET() {
  try {
    const categories = await db
      .select({
        id: categoryTable.id,
        name: categoryTable.name,
        slug: categoryTable.slug,
      })
      .from(categoryTable);

    return NextResponse.json(categories);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
