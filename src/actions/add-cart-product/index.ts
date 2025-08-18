"use server";

import { and, eq } from "drizzle-orm";
import { headers } from "next/headers";

import { db } from "@/db";
import { cartItemTable, cartTable } from "@/db/schema";
import { auth } from "@/lib/auth";

import { AddProductToCartSchema, addProductToCartSchema } from "./schema";

export const addProductToCart = async (
  data: AddProductToCartSchema,
): Promise<{ success: true } | { error: string }> => {
  try {
    addProductToCartSchema.parse(data);
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user) {
      return { error: "Unauthorized" };
    }
    const productVariant = await db.query.productVariantTable.findFirst({
      where: (productVariant, { eq }) =>
        eq(productVariant.id, data.productVariantId),
    });
    if (!productVariant) {
      return { error: "Product variant not found" };
    }
    const cart = await db.query.cartTable.findFirst({
      where: (cart, { eq }) => eq(cart.userId, session.user.id),
    });
    let cartId = cart?.id;
    if (!cartId) {
      const [newCart] = await db
        .insert(cartTable)
        .values({
          userId: session.user.id,
        })
        .returning();
      cartId = newCart.id;
    }
    const cartItem = await db.query.cartItemTable.findFirst({
      where: (cartItem, { eq, and }) =>
        and(
          eq(cartItem.cartId, cartId),
          eq(cartItem.productVariantId, data.productVariantId),
        ),
    });
    if (cartItem) {
      await db
        .update(cartItemTable)
        .set({
          quantity: cartItem.quantity + data.quantity,
        })
        .where(eq(cartItemTable.id, cartItem.id));
      return { success: true };
    }
    await db.insert(cartItemTable).values({
      cartId,
      productVariantId: data.productVariantId,
      quantity: data.quantity,
    });
    return { success: true };
  } catch (error) {
    console.error("addProductToCart error", error);
    const message =
      error instanceof Error
        ? error.message
        : "Unexpected error while adding product to cart";
    return { error: message };
  }
};
