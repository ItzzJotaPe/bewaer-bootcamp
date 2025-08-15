import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
    <div className="container mx-auto px-4 py-6 sm:py-8">
      <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold sm:text-3xl">
          Painel Administrativo
        </h1>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button
            variant="outline"
            asChild
            className="w-full border-slate-300 text-slate-700 hover:border-slate-400 hover:bg-slate-50 sm:w-auto"
          >
            <Link href="/">Voltar à Loja</Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="transition-shadow hover:shadow-lg">
          <CardContent className="p-4 sm:p-6">
            <h2 className="mb-3 text-lg font-semibold sm:mb-4 sm:text-xl">
              Produtos
            </h2>
            <p className="mb-4 text-sm text-gray-600 sm:text-base">
              Gerencie produtos e variantes
            </p>
            <Button
              asChild
              className="w-full bg-slate-700 text-white transition-colors hover:bg-slate-800 sm:w-auto"
            >
              <Link href="/admin/products">Gerenciar Produtos</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="transition-shadow hover:shadow-lg">
          <CardContent className="p-4 sm:p-6">
            <h2 className="mb-3 text-lg font-semibold sm:mb-4 sm:text-xl">
              Categorias
            </h2>
            <p className="mb-4 text-sm text-gray-600 sm:text-base">
              Gerencie categorias de produtos
            </p>
            <Button
              asChild
              className="w-full bg-slate-700 text-white transition-colors hover:bg-slate-800 sm:w-auto"
            >
              <Link href="/admin/categories">Gerenciar Categorias</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="transition-shadow hover:shadow-lg">
          <CardContent className="p-4 sm:p-6">
            <h2 className="mb-3 text-lg font-semibold sm:mb-4 sm:text-xl">
              Pedidos
            </h2>
            <p className="mb-4 text-sm text-gray-600 sm:text-base">
              Visualize e gerencie pedidos
            </p>
            <Button
              asChild
              className="w-full bg-slate-700 text-white transition-colors hover:bg-slate-800 sm:w-auto"
            >
              <Link href="/admin/orders">Ver Pedidos</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
