import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import Link from "next/link";
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
        createdAt: category.createdAt.toISOString(),
      };
    }),
  );

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8">
      <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold sm:text-3xl">Gerenciar Categorias</h1>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button
            variant="outline"
            asChild
            className="w-full border-slate-300 text-slate-700 hover:border-slate-400 hover:bg-slate-50 sm:w-auto"
          >
            <Link href="/">Voltar à Loja</Link>
          </Button>
          <Button
            variant="outline"
            asChild
            className="w-full border-slate-300 text-slate-700 hover:border-slate-400 hover:bg-slate-50 sm:w-auto"
          >
            <Link href="/admin">Voltar ao Painel</Link>
          </Button>
        </div>
      </div>

      <CategoriesContainer initialCategories={categoriesWithCount} />
    </div>
  );
}
