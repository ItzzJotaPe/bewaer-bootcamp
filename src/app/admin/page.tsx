import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { db } from "@/db";
import { userTable } from "@/db/schema";
import { auth } from "@/lib/auth";

export default async function AdminPage() {
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

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Painel Administrativo</h1>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border bg-white p-6 shadow-md">
          <h2 className="mb-4 text-xl font-semibold">Produtos</h2>
          <p className="mb-4 text-gray-600">Gerencie produtos e variantes</p>
          <a
            href="/admin/products"
            className="inline-block rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
          >
            Gerenciar Produtos
          </a>
        </div>

        <div className="rounded-lg border bg-white p-6 shadow-md">
          <h2 className="mb-4 text-xl font-semibold">Categorias</h2>
          <p className="mb-4 text-gray-600">Gerencie categorias de produtos</p>
          <a
            href="/admin/categories"
            className="inline-block rounded-md bg-green-600 px-4 py-2 text-white transition-colors hover:bg-green-700"
          >
            Gerenciar Categorias
          </a>
        </div>

        <div className="rounded-lg border bg-white p-6 shadow-md">
          <h2 className="mb-4 text-xl font-semibold">Pedidos</h2>
          <p className="mb-4 text-gray-600">Visualize e gerencie pedidos</p>
          <a
            href="/admin/orders"
            className="inline-block rounded-md bg-purple-600 px-4 py-2 text-white transition-colors hover:bg-purple-700"
          >
            Ver Pedidos
          </a>
        </div>
      </div>
    </div>
  );
}
