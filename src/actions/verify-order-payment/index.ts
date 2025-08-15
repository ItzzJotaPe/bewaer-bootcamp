"use server";

import { eq } from "drizzle-orm";
import Stripe from "stripe";

import { db } from "@/db";
import { orderTable } from "@/db/schema";

export const verifyOrderPayment = async (orderId: string) => {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("Stripe secret key is not set");
  }

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    const order = await db.query.orderTable.findFirst({
      where: eq(orderTable.id, orderId),
    });

    if (!order) {
      throw new Error("Order not found");
    }

    if (order.status === "paid") {
      return { status: "paid", message: "Order is already paid" };
    }

    const sessions = await stripe.checkout.sessions.list({
      limit: 100,
    });

    const session = sessions.data.find(
      (session) => session.metadata?.orderId === orderId,
    );

    if (session && session.payment_status === "paid") {
      await db
        .update(orderTable)
        .set({ status: "paid" })
        .where(eq(orderTable.id, orderId));

      return { status: "paid", message: "Order payment verified and updated" };
    }

    if (session && session.payment_status === "unpaid") {
      return { status: "pending", message: "Payment is still pending" };
    }

    return {
      status: "unknown",
      message: "Payment status could not be determined",
    };
  } catch (error) {
    console.error("Error verifying order payment:", error);
    throw new Error("Failed to verify order payment");
  }
};
