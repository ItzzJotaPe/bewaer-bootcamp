import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { db } from "@/db";
import { categoryTable, productTable, userTable } from "@/db/schema";
import { auth } from "@/lib/auth";

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
      };
    }),
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Gerenciar Categorias</h1>
        <a
          href="/admin"
          className="rounded-md bg-gray-600 px-4 py-2 text-white transition-colors hover:bg-gray-700"
        >
          Voltar ao Painel
        </a>
      </div>

      <div className="mb-6">
        <button className="rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700">
          + Adicionar Nova Categoria
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {categoriesWithCount.map((category) => (
          <div
            key={category.id}
            className="rounded-lg border bg-white p-6 shadow-md"
          >
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h2 className="text-xl font-semibold">{category.name}</h2>
                <div className="mt-2 space-y-1 text-sm text-gray-500">
                  <p>Slug: {category.slug}</p>
                  <p>Produtos: {category.productCount}</p>
                  <p>
                    Criado em:{" "}
                    {new Date(category.createdAt).toLocaleDateString("pt-BR")}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="rounded-md bg-green-600 px-3 py-1 text-sm text-white transition-colors hover:bg-green-700">
                  Editar
                </button>
                <button
                  className={`rounded-md px-3 py-1 text-sm text-white transition-colors ${
                    category.productCount > 0
                      ? "cursor-not-allowed bg-gray-400"
                      : "bg-red-600 hover:bg-red-700"
                  }`}
                  disabled={category.productCount > 0}
                  title={
                    category.productCount > 0
                      ? "Não é possível excluir categoria com produtos"
                      : "Excluir categoria"
                  }
                >
                  Excluir
                </button>
              </div>
            </div>

            <div className="flex gap-2">
              <button className="rounded-md bg-blue-600 px-3 py-1 text-sm text-white transition-colors hover:bg-blue-700">
                Ver Produtos
              </button>
            </div>
          </div>
        ))}

        {categoriesWithCount.length === 0 && (
          <div className="col-span-full rounded-lg border bg-white p-8 text-center">
            <h3 className="mb-2 text-lg font-semibold">
              Nenhuma categoria cadastrada
            </h3>
            <p className="text-gray-600">
              Comece adicionando sua primeira categoria
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
