import { NextResponse } from "next/server";

export const GET = async () => {
  return NextResponse.json({
    message: "Webhook test endpoint is working",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    stripeKeyConfigured: !!process.env.STRIPE_SECRET_KEY,
    webhookSecretConfigured: !!process.env.STRIPE_WEBHOOK_SECRET,
  });
};
