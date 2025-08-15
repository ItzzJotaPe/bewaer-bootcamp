"use server";

import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { db } from "@/db";
import { orderTable, userTable } from "@/db/schema";
import { auth } from "@/lib/auth";

export const updateOrderStatus = async (orderId: string, status: string) => {
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

  await db
    .update(orderTable)
    .set({ status: status as "pending" | "paid" | "canceled" })
    .where(eq(orderTable.id, orderId));

  return { success: true };
};
