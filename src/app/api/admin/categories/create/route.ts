import { NextRequest, NextResponse } from "next/server";

import { db } from "@/db";
import { categoryTable } from "@/db/schema";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, slug } = body;

    if (!name || !slug) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    await db.insert(categoryTable).values({ name, slug });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create category" },
      { status: 500 },
    );
  }
}
