import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { OrdersContainer } from "./components/orders-container";
import { Button } from "@/components/ui/button";
import { db } from "@/db";
import { userTable } from "@/db/schema";
import { auth } from "@/lib/auth";

export default async function AdminOrdersPage() {
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
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Visualizar Pedidos</h1>
        <Button
          variant="outline"
          asChild
          className="border-slate-300 text-slate-700 hover:border-slate-400 hover:bg-slate-50"
        >
          <a href="/admin">Voltar ao Painel</a>
        </Button>
      </div>

      <OrdersContainer />
    </div>
  );
}
