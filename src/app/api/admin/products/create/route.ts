import { NextRequest, NextResponse } from "next/server";

import { db } from "@/db";
import { productTable } from "@/db/schema";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("API - Dados recebidos:", body);

    const { name, description, slug, imageUrl, categoryId } = body;

    if (!name || !description || !slug || !categoryId) {
      console.log("API - Campos obrigatórios faltando:", {
        name,
        description,
        slug,
        categoryId,
      });
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 },
      );
    }

    console.log("API - Inserindo produto no banco...");
    console.log("API - ImageUrl recebido:", imageUrl);
    console.log("API - ImageUrl será salvo como:", imageUrl || null);

    const [product] = await db
      .insert(productTable)
      .values({
        name,
        description,
        slug,
        imageUrl: imageUrl || null,
        categoryId,
      })
      .returning();

    console.log("API - Produto criado com sucesso:", product);
    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.error("API - Erro ao criar produto:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 },
    );
  }
}
