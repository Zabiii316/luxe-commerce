import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@luxe/database";

export async function POST(request: Request) {
  try {
    const { orderId } = await request.json();

    if (!orderId || typeof orderId !== "string") {
      return NextResponse.json(
        {
          ok: false,
          message: "Order ID is required",
        },
        { status: 400 },
      );
    }

    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        {
          ok: false,
          message: "Stripe secret key is missing. Add STRIPE_SECRET_KEY to apps/web/.env.local",
        },
        { status: 500 },
      );
    }

    const order = await prisma.order.findUnique({
      where: {
        id: orderId,
      },
      include: {
        customer: true,
        items: true,
      },
    });

    if (!order) {
      return NextResponse.json(
        {
          ok: false,
          message: "Order not found",
        },
        { status: 404 },
      );
    }

    if (order.status !== "PAYMENT_PENDING") {
      return NextResponse.json(
        {
          ok: false,
          message: "This order is not awaiting payment",
        },
        { status: 400 },
      );
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round((Number(order.total) > 0 ? Number(order.total) : Number(order.subtotal)) * 100),
      currency: order.currency.toLowerCase(),
      automatic_payment_methods: {
        enabled: true,
      },
      receipt_email: order.customer.email,
      metadata: {
        orderId: order.id,
      },
    });

    await prisma.order.update({
      where: {
        id: order.id,
      },
      data: {
        paymentRef: paymentIntent.id,
      },
    });

    return NextResponse.json({
      ok: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        message: error instanceof Error ? error.message : "PaymentIntent creation failed",
      },
      { status: 500 },
    );
  }
}
