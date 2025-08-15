import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import { db } from "@/db";
import { categoryTable, productTable, userTable } from "@/db/schema";
import { auth } from "@/lib/auth";

import { CategoriesContainer } from "./components/categories-container";

export default async function AdminCategoriesPage() {
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

  // Carregar categorias no servidor
  const categories = await db
    .select({
      id: categoryTable.id,
      name: categoryTable.name,
      slug: categoryTable.slug,
      createdAt: categoryTable.createdAt,
    })
    .from(categoryTable);

  const categoriesWithCount = await Promise.all(
    categories.map(async (category) => {
      const productCountResult = await db
        .select({ count: productTable.id })
        .from(productTable)
        .where(eq(productTable.categoryId, category.id));

      return {
        ...category,
        productCount: productCountResult.length,
        createdAt: category.createdAt.toISOString(), // Converter para string
      };
    }),
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Gerenciar Categorias</h1>
        <Button
          variant="outline"
          asChild
          className="border-slate-300 text-slate-700 hover:border-slate-400 hover:bg-slate-50"
        >
          <a href="/admin">Voltar ao Painel</a>
        </Button>
      </div>

      <CategoriesContainer initialCategories={categoriesWithCount} />
    </div>
  );
}
