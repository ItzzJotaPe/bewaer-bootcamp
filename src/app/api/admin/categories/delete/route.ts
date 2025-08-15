import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { categoryTable, productTable } from "@/db/schema";

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Missing category ID" },
        { status: 400 },
      );
    }

    // Verificar se há produtos usando esta categoria
    const productsInCategory = await db
      .select({ id: productTable.id })
      .from(productTable)
      .where(eq(productTable.categoryId, id))
      .limit(1);

    if (productsInCategory.length > 0) {
      return NextResponse.json(
        { error: "Não é possível excluir categoria com produtos" },
        { status: 400 },
      );
    }

    await db.delete(categoryTable).where(eq(categoryTable.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete category" },
      { status: 500 },
    );
  }
}
