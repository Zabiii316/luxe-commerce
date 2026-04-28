import Stripe from "stripe";
import { NextResponse } from "next/server";
import { prisma } from "@luxe/database";
import { sendPaymentSuccessEmail } from "@/lib/email/send-payment-success-email";

export const runtime = "nodejs";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

if (!stripeSecretKey) {
  throw new Error("Missing STRIPE_SECRET_KEY");
}

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: "2026-03-25.dahlia",
});

export async function POST(request: Request) {
  if (!webhookSecret) {
    return NextResponse.json(
      { ok: false, message: "Missing STRIPE_WEBHOOK_SECRET" },
      { status: 500 },
    );
  }

  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { ok: false, message: "Missing Stripe signature" },
      { status: 400 },
    );
  }

  let event: Stripe.Event;

  try {
    const rawBody = await request.text();
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        message: error instanceof Error ? error.message : "Webhook signature verification failed",
      },
      { status: 400 },
    );
  }

  try {
    switch (event.type) {
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const orderId = paymentIntent.metadata?.orderId;

        if (!orderId) {
          break;
        }

        const existingOrder = await prisma.order.findUnique({
          where: { id: orderId },
          select: { id: true, status: true, paymentRef: true },
        });

        if (!existingOrder) {
          break;
        }

        const wasAlreadyPaid = existingOrder.status === "PAID";

        await prisma.order.update({
          where: { id: orderId },
          data: {
            status: "PAID",
            paymentRef: paymentIntent.id,
          },
        });

        if (!wasAlreadyPaid) {
          await sendPaymentSuccessEmail(orderId);
        }

        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const orderId = paymentIntent.metadata?.orderId;

        if (!orderId) {
          break;
        }

        await prisma.order.update({
          where: { id: orderId },
          data: {
            status: "CANCELLED",
            paymentRef: paymentIntent.id,
          },
        });

        break;
      }

      default:
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        message: error instanceof Error ? error.message : "Webhook handling failed",
      },
      { status: 500 },
    );
  }
}
