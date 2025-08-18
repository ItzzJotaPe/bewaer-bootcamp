"use server";

import { headers } from "next/headers";

import { db } from "@/db";
import { cartTable } from "@/db/schema";
import { auth } from "@/lib/auth";

export const getCart = async (): Promise<{
  id: string;
  userId: string;
  createdAt: Date;
  items: Array<{
    id: string;
    cartId: string;
    productVariantId: string;
    quantity: number;
    createdAt: Date;
    productVariant: {
      id: string;
      name: string;
      slug: string;
      color: string;
      priceInCents: number;
      imageUrl: string;
      product: {
        id: string;
        name: string;
        description: string;
      };
    };
  }>;
  totalPriceInCents: number;
  shippingAddress: null | {
    id: string;
    userId: string;
    zipCode: string;
    state: string;
    city: string;
    street: string;
    number: string | null;
    complement: string | null;
    neighborhood: string | null;
    createdAt: Date;
  };
}> => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user) {
      return {
        id: "",
        userId: "",
        createdAt: new Date(),
        items: [],
        totalPriceInCents: 0,
        shippingAddress: null,
      };
    }
    const cart = await db.query.cartTable.findFirst({
      where: (cart, { eq }) => eq(cart.userId, session.user.id),
      with: {
        shippingAddress: true,
        items: {
          with: {
            productVariant: {
              with: {
                product: true,
              },
            },
          },
        },
      },
    });
    if (!cart) {
      const [newCart] = await db
        .insert(cartTable)
        .values({
          userId: session.user.id,
        })
        .returning();
      return {
        ...newCart,
        items: [],
        totalPriceInCents: 0,
        shippingAddress: null,
      };
    }
    return {
      ...cart,
      totalPriceInCents: cart.items.reduce(
        (acc, item) => acc + item.productVariant.priceInCents * item.quantity,
        0,
      ),
    };
  } catch {
    return {
      id: "",
      userId: "",
      createdAt: new Date(),
      items: [],
      totalPriceInCents: 0,
      shippingAddress: null,
    };
  }
};
