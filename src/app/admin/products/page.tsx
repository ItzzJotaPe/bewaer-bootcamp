import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { db } from "@/db";
import {
  categoryTable,
  productTable,
  productVariantTable,
  userTable,
} from "@/db/schema";
import { auth } from "@/lib/auth";

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
        variants,
      };
    }),
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Gerenciar Produtos</h1>
        <a
          href="/admin"
          className="rounded-md bg-gray-600 px-4 py-2 text-white transition-colors hover:bg-gray-700"
        >
          Voltar ao Painel
        </a>
      </div>

      <div className="mb-6">
        <button className="rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700">
          + Adicionar Novo Produto
        </button>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {productsWithVariants.map((product) => (
          <div
            key={product.id}
            className="overflow-hidden rounded-lg border bg-white shadow-md transition-shadow hover:shadow-lg"
          >
            {/* Imagem principal do produto - usando a primeira variante como imagem principal */}
            <div className="relative h-64 w-full overflow-hidden bg-gray-100">
              {product.variants.length > 0 ? (
                <img
                  src={product.variants[0].imageUrl}
                  alt={product.name}
                  className="h-full w-full object-cover transition-transform hover:scale-105"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-gray-400">
                  <span className="text-sm">Sem imagem</span>
                </div>
              )}

              {/* Badge de categoria */}
              {product.category && (
                <div className="absolute top-3 left-3 rounded-full bg-blue-600 px-2 py-1 text-xs text-white">
                  {product.category.name}
                </div>
              )}

              {/* Badge de quantidade de variantes */}
              <div className="absolute top-3 right-3 rounded-full bg-gray-800 px-2 py-1 text-xs text-white">
                {product.variants.length} variante
                {product.variants.length !== 1 ? "s" : ""}
              </div>
            </div>

            {/* Informações do produto */}
            <div className="p-4">
              <div className="mb-3">
                <h2 className="mb-2 text-lg font-semibold text-gray-900">
                  {product.name}
                </h2>
                <p className="line-clamp-2 text-sm text-gray-600">
                  {product.description}
                </p>
              </div>

              <div className="mb-4 space-y-1 text-xs text-gray-500">
                <p>Slug: {product.slug}</p>
                <p>
                  Criado em:{" "}
                  {new Date(product.createdAt).toLocaleDateString("pt-BR")}
                </p>
              </div>

              {/* Botões de ação do produto */}
              <div className="mb-4 flex gap-2">
                <button className="flex-1 rounded-md bg-green-600 px-3 py-2 text-sm text-white transition-colors hover:bg-green-700">
                  Editar Produto
                </button>
                <button className="flex-1 rounded-md bg-red-600 px-3 py-2 text-sm text-white transition-colors hover:bg-red-700">
                  Excluir
                </button>
              </div>

              {/* Variantes do produto */}
              <div className="mb-4">
                <h3 className="mb-3 text-sm font-semibold text-gray-700">
                  Variantes ({product.variants.length})
                </h3>

                {product.variants.length > 0 ? (
                  <div className="space-y-3">
                    {product.variants.map((variant) => (
                      <div
                        key={variant.id}
                        className="flex items-center gap-3 rounded-md border p-3"
                      >
                        <div className="h-16 w-16 overflow-hidden rounded-md">
                          <img
                            src={variant.imageUrl}
                            alt={variant.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">
                            {variant.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            {variant.color}
                          </p>
                          <p className="text-sm font-semibold text-blue-600">
                            R$ {(variant.priceInCents / 100).toFixed(2)}
                          </p>
                        </div>
                        <div className="flex gap-1">
                          <button className="rounded bg-blue-600 px-2 py-1 text-xs text-white transition-colors hover:bg-blue-700">
                            Editar
                          </button>
                          <button className="rounded bg-red-600 px-2 py-1 text-xs text-white transition-colors hover:bg-red-700">
                            Excluir
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 italic">
                    Nenhuma variante cadastrada
                  </p>
                )}
              </div>

              {/* Botão para adicionar variante */}
              <button className="w-full rounded-md bg-blue-600 px-3 py-2 text-sm text-white transition-colors hover:bg-blue-700">
                + Adicionar Variante
              </button>
            </div>
          </div>
        ))}

        {productsWithVariants.length === 0 && (
          <div className="col-span-full rounded-lg border bg-white p-8 text-center">
            <h3 className="mb-2 text-lg font-semibold">
              Nenhum produto cadastrado
            </h3>
            <p className="text-gray-600">
              Comece adicionando seu primeiro produto
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
