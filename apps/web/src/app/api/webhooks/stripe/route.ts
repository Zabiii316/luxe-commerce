import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@luxe/database";

export async function POST(request: Request) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json(
      {
        ok: false,
        message: "Missing STRIPE_SECRET_KEY",
      },
      { status: 500 },
    );
  }

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json(
      {
        ok: false,
        message: "Missing STRIPE_WEBHOOK_SECRET",
      },
      { status: 500 },
    );
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return new Response("Missing stripe-signature header", { status: 400 });
  }

  const rawBody = await request.text();

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch {
    return new Response("Invalid Stripe webhook signature", { status: 400 });
  }

  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    const orderId = paymentIntent.metadata.orderId;

    if (orderId) {
      await prisma.order.update({
        where: {
          id: orderId,
        },
        data: {
          status: "PAID",
          paymentRef: paymentIntent.id,
        },
      });
    }
  }

  if (event.type === "payment_intent.payment_failed") {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    const orderId = paymentIntent.metadata.orderId;

    if (orderId) {
      await prisma.order.update({
        where: {
          id: orderId,
        },
        data: {
          status: "CANCELLED",
          paymentRef: paymentIntent.id,
        },
      });
    }
  }

  return NextResponse.json({
    received: true,
  });
}
