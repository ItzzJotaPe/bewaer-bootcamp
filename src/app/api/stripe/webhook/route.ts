import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import Stripe from "stripe";

import { db } from "@/db";
import { orderTable } from "@/db/schema";

export const POST = async (request: Request) => {
  try {
    console.log("=== WEBHOOK RECEIVED ===");
    console.log("Timestamp:", new Date().toISOString());
    console.log("Method:", request.method);
    console.log("URL:", request.url);

    if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
      console.error("❌ Stripe environment variables not configured");
      console.error("STRIPE_SECRET_KEY:", !!process.env.STRIPE_SECRET_KEY);
      console.error(
        "STRIPE_WEBHOOK_SECRET:",
        !!process.env.STRIPE_WEBHOOK_SECRET,
      );
      return NextResponse.error();
    }

    const signature = request.headers.get("stripe-signature");
    if (!signature) {
      console.error("❌ Missing Stripe signature");
      return NextResponse.error();
    }

    console.log(
      "✅ Stripe signature found:",
      signature.substring(0, 20) + "...",
    );

    const text = await request.text();
    console.log("📝 Request body length:", text.length);

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(
        text,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET,
      );
      console.log("✅ Webhook signature verified successfully");
    } catch (err) {
      console.error("❌ Webhook signature verification failed:", err);
      return NextResponse.error();
    }

    console.log("🎯 Event type:", event.type);
    console.log("🎯 Event ID:", event.id);
    console.log(
      "🎯 Event created:",
      new Date(event.created * 1000).toISOString(),
    );

    switch (event.type) {
      case "checkout.session.completed":
        console.log("🔄 Processing checkout.session.completed");
        await handleCheckoutSessionCompleted(
          event.data.object as Stripe.Checkout.Session,
        );
        break;

      case "payment_intent.succeeded":
        console.log("🔄 Processing payment_intent.succeeded");
        await handlePaymentIntentSucceeded(
          event.data.object as Stripe.PaymentIntent,
        );
        break;

      case "payment_intent.payment_failed":
        console.log("🔄 Processing payment_intent.payment_failed");
        await handlePaymentIntentFailed(
          event.data.object as Stripe.PaymentIntent,
        );
        break;

      case "invoice.payment_succeeded":
        console.log("🔄 Processing invoice.payment_succeeded");
        await handleInvoicePaymentSucceeded(
          event.data.object as Stripe.Invoice,
        );
        break;

      default:
        console.log(`⚠️ Unhandled event type: ${event.type}`);
    }

    console.log("✅ Webhook processed successfully");
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("❌ Webhook error:", error);
    return NextResponse.error();
  }
};

async function handleCheckoutSessionCompleted(
  session: Stripe.Checkout.Session,
) {
  console.log("📋 Session details:");
  console.log("  - Session ID:", session.id);
  console.log("  - Payment status:", session.payment_status);
  console.log("  - Customer email:", session.customer_details?.email);
  console.log("  - Metadata:", session.metadata);

  const orderId = session.metadata?.orderId;

  if (!orderId) {
    console.error("❌ No orderId in session metadata");
    return;
  }

  console.log("🔍 Looking for order:", orderId);

  try {
    const result = await db
      .update(orderTable)
      .set({ status: "paid" })
      .where(eq(orderTable.id, orderId))
      .returning();

    if (result.length > 0) {
      console.log(`✅ Order ${orderId} status updated to paid`);
      console.log("  - Updated order:", result[0]);
    } else {
      console.log(`⚠️ Order ${orderId} not found in database`);
    }
  } catch (error) {
    console.error(`❌ Failed to update order ${orderId}:`, error);
  }
}

async function handlePaymentIntentSucceeded(
  paymentIntent: Stripe.PaymentIntent,
) {
  console.log("📋 Payment Intent details:");
  console.log("  - Payment Intent ID:", paymentIntent.id);
  console.log("  - Amount:", paymentIntent.amount);
  console.log("  - Currency:", paymentIntent.currency);
  console.log("  - Metadata:", paymentIntent.metadata);

  if (paymentIntent.metadata?.orderId) {
    const orderId = paymentIntent.metadata.orderId;
    console.log("🔍 Looking for order:", orderId);

    try {
      const result = await db
        .update(orderTable)
        .set({ status: "paid" })
        .where(eq(orderTable.id, orderId))
        .returning();

      if (result.length > 0) {
        console.log(
          `✅ Order ${orderId} status updated to paid via payment_intent.succeeded`,
        );
      } else {
        console.log(`⚠️ Order ${orderId} not found in database`);
      }
    } catch (error) {
      console.error(`❌ Failed to update order ${orderId}:`, error);
    }
  } else {
    console.log("⚠️ No orderId in payment intent metadata");
  }
}

async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
  console.log("📋 Failed Payment Intent details:");
  console.log("  - Payment Intent ID:", paymentIntent.id);
  console.log("  - Last payment error:", paymentIntent.last_payment_error);
  console.log("  - Metadata:", paymentIntent.metadata);

  if (paymentIntent.metadata?.orderId) {
    const orderId = paymentIntent.metadata.orderId;
    console.log("🔍 Looking for order:", orderId);

    try {
      const result = await db
        .update(orderTable)
        .set({ status: "canceled" })
        .where(eq(orderTable.id, orderId))
        .returning();

      if (result.length > 0) {
        console.log(
          `✅ Order ${orderId} status updated to canceled due to payment failure`,
        );
      } else {
        console.log(`⚠️ Order ${orderId} not found in database`);
      }
    } catch (error) {
      console.error(`❌ Failed to update order ${orderId}:`, error);
    }
  } else {
    console.log("⚠️ No orderId in payment intent metadata");
  }
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  console.log("📋 Invoice details:");
  console.log("  - Invoice ID:", invoice.id);
  console.log("  - Customer:", invoice.customer);
  console.log("  - Metadata:", invoice.metadata);

  if (invoice.metadata?.orderId) {
    const orderId = invoice.metadata.orderId;
    console.log("🔍 Looking for order:", orderId);

    try {
      const result = await db
        .update(orderTable)
        .set({ status: "paid" })
        .where(eq(orderTable.id, orderId))
        .returning();

      if (result.length > 0) {
        console.log(
          `✅ Order ${orderId} status updated to paid via invoice.payment_succeeded`,
        );
      } else {
        console.log(`⚠️ Order ${orderId} not found in database`);
      }
    } catch (error) {
      console.error(`❌ Failed to update order ${orderId}:`, error);
    }
  } else {
    console.log("⚠️ No orderId in invoice metadata");
  }
}
