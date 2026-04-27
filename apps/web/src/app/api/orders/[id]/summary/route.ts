import { NextResponse } from "next/server";
import { prisma } from "@luxe/database";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;

  const order = await prisma.order.findUnique({
    where: { id },
    select: {
      id: true,
      subtotal: true,
      discountCode: true,
      discountAmount: true,
      total: true,
      currency: true,
      status: true,
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

  return NextResponse.json({
    ok: true,
    order: {
      id: order.id,
      subtotal: Number(order.subtotal),
      discountCode: order.discountCode,
      discountAmount: Number(order.discountAmount),
      total: Number(order.total),
      currency: order.currency,
      status: order.status,
    },
  });
}
