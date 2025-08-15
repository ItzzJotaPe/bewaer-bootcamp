"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { db } from "@/db";
import {
  orderTable,
  orderItemTable,
  productVariantTable,
  productTable,
  userTable,
} from "@/db/schema";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";

export type AdminOrderItem = {
  id: string;
  quantity: number;
  priceInCents: number;
  productVariant: {
    id: string;
    name: string;
    color: string;
    product: {
      id: string;
      name: string;
    };
  };
};

export type AdminOrder = {
  id: string;
  status: string;
  totalPriceInCents: number;
  createdAt: Date;
  recipientName: string;
  email: string;
  phone: string;
  street: string;
  number: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  cpfOrCnpj: string;
  items: AdminOrderItem[];
};

export const getAdminOrders = async (): Promise<AdminOrder[]> => {
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

  const orders = await db
    .select({
      id: orderTable.id,
      status: orderTable.status,
      totalPriceInCents: orderTable.totalPriceInCents,
      createdAt: orderTable.createdAt,
      recipientName: orderTable.recipientName,
      email: orderTable.email,
      phone: orderTable.phone,
      street: orderTable.street,
      number: orderTable.number,
      city: orderTable.city,
      state: orderTable.state,
      zipCode: orderTable.zipCode,
      country: orderTable.country,
      cpfOrCnpj: orderTable.cpfOrCnpj,
    })
    .from(orderTable);

  const ordersWithItems: AdminOrder[] = await Promise.all(
    orders.map(async (order) => {
      const itemsResult = await db
        .select({
          id: orderItemTable.id,
          quantity: orderItemTable.quantity,
          priceInCents: orderItemTable.priceInCents,
          productVariantId: orderItemTable.productVariantId,
        })
        .from(orderItemTable)
        .where(eq(orderItemTable.orderId, order.id));

      const items: AdminOrderItem[] = await Promise.all(
        itemsResult.map(async (item) => {
          const variant = await db
            .select({
              id: productVariantTable.id,
              name: productVariantTable.name,
              color: productVariantTable.color,
              productId: productVariantTable.productId,
            })
            .from(productVariantTable)
            .where(eq(productVariantTable.id, item.productVariantId))
            .limit(1);

          if (!variant.length) {
            throw new Error(
              `Product variant not found: ${item.productVariantId}`,
            );
          }

          const product = await db
            .select({
              id: productTable.id,
              name: productTable.name,
            })
            .from(productTable)
            .where(eq(productTable.id, variant[0].productId))
            .limit(1);

          if (!product.length) {
            throw new Error(`Product not found: ${variant[0].productId}`);
          }

          return {
            id: item.id,
            quantity: item.quantity,
            priceInCents: item.priceInCents,
            productVariant: {
              id: variant[0].id,
              name: variant[0].name,
              color: variant[0].color,
              product: {
                id: product[0].id,
                name: product[0].name,
              },
            },
          };
        }),
      );

      return {
        ...order,
        items,
      };
    }),
  );

  return ordersWithItems;
};
