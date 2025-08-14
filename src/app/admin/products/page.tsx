import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import { db } from "@/db";
import {
  categoryTable,
  productTable,
  productVariantTable,
  userTable,
} from "@/db/schema";
import { auth } from "@/lib/auth";

import { ProductsContainer } from "./components/products-container";

export default async function AdminProductsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    redirect("/authentication");
  }

  const user = await db
    .select()
    .from(userTable)
    .where(eq(userTable.id, session.user.id))
    .limit(1);

  if (!user.length || user[0].role !== "adm") {
    redirect("/");
  }

  const products = await db
    .select({
      id: productTable.id,
      name: productTable.name,
      slug: productTable.slug,
      description: productTable.description,
      createdAt: productTable.createdAt,
      category: {
        id: categoryTable.id,
        name: categoryTable.name,
        slug: categoryTable.slug,
      },
    })
    .from(productTable)
    .leftJoin(categoryTable, eq(productTable.categoryId, categoryTable.id));

  const productsWithVariants = await Promise.all(
    products.map(async (product) => {
      const variants = await db
        .select({
          id: productVariantTable.id,
          name: productVariantTable.name,
          color: productVariantTable.color,
          priceInCents: productVariantTable.priceInCents,
          imageUrl: productVariantTable.imageUrl,
        })
        .from(productVariantTable)
        .where(eq(productVariantTable.productId, product.id));

      return {
        ...product,
        category: product.category || undefined,
        variants,
      };
    }),
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Gerenciar Produtos</h1>
        <Button variant="outline" asChild>
          <a href="/admin">Voltar ao Painel</a>
        </Button>
      </div>

      <ProductsContainer products={productsWithVariants} />
    </div>
  );
}
