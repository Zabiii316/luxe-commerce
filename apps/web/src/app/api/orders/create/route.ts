import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@luxe/database";
import { getProductsBySkus } from "@/lib/data/products";
import { checkoutCustomerSchema } from "@/lib/validators/checkout";

const orderCreateSchema = z.object({
  customer: checkoutCustomerSchema,
  couponCode: z.string().optional().or(z.literal("")),
  clientSubtotal: z.number().nonnegative(),
  lineItems: z
    .array(
      z.object({
        sku: z.string().min(1),
        quantity: z.number().int().min(1),
        clientUnitPrice: z.number().nonnegative(),
      }),
    )
    .min(1),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = orderCreateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, message: "Invalid checkout data", errors: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const { customer, lineItems } = parsed.data;
    const requestedCoupon = parsed.data.couponCode?.trim().toUpperCase() || "";

    const products = await getProductsBySkus(lineItems.map((item) => item.sku));

    if (!products.length || products.length !== lineItems.length) {
      return NextResponse.json(
        { ok: false, message: "Some products are no longer available." },
        { status: 400 },
      );
    }

    const productMap = new Map(products.map((product) => [product.sku, product]));

    let subtotal = 0;
    const orderItems = lineItems.map((item) => {
      const product = productMap.get(item.sku);

      if (!product) {
        throw new Error(`Product ${item.sku} not found`);
      }

      if (product.stock < item.quantity) {
        throw new Error(`${product.name} does not have enough stock`);
      }

      const unitPrice = product.price;
      const lineTotal = unitPrice * item.quantity;
      subtotal += lineTotal;

      return {
        productSku: product.sku,
        name: product.name,
        quantity: item.quantity,
        unitPrice,
        lineTotal,
      };
    });

    let discountCode: string | null = null;
    let discountAmount = 0;

    if (requestedCoupon) {
      const now = new Date();

      const discount = await prisma.discountCode.findFirst({
        where: {
          code: requestedCoupon,
          isActive: true,
          OR: [{ startsAt: null }, { startsAt: { lte: now } }],
          AND: [{ OR: [{ endsAt: null }, { endsAt: { gte: now } }] }],
        },
      });

      if (!discount) {
        return NextResponse.json(
          { ok: false, message: "This discount code is invalid or expired." },
          { status: 400 },
        );
      }

      if (discount.usageLimit != null && discount.usedCount >= discount.usageLimit) {
        return NextResponse.json(
          { ok: false, message: "This discount code has reached its usage limit." },
          { status: 400 },
        );
      }

      if (discount.minOrderAmount != null && subtotal < Number(discount.minOrderAmount)) {
        return NextResponse.json(
          {
            ok: false,
            message: `This code requires a minimum order of $${Number(discount.minOrderAmount).toFixed(2)}.`,
          },
          { status: 400 },
        );
      }

      discountCode = discount.code;

      if (discount.type === "PERCENT") {
        discountAmount = subtotal * (Number(discount.value) / 100);
      } else {
        discountAmount = Number(discount.value);
      }

      if (discountAmount > subtotal) {
        discountAmount = subtotal;
      }
    }

    const total = Math.max(0, subtotal - discountAmount);

    const savedCustomer = await prisma.customer.upsert({
      where: {
        email: customer.email.toLowerCase().trim(),
      },
      update: {
        firstName: customer.firstName,
        lastName: customer.lastName,
      },
      create: {
        firstName: customer.firstName,
        lastName: customer.lastName,
        email: customer.email.toLowerCase().trim(),
      },
      select: {
        id: true,
        email: true,
      },
    });

    const order = await prisma.$transaction(async (tx) => {
      const createdOrder = await tx.order.create({
        data: {
          id: randomUUID(),
          customer: {
            connect: {
              email: savedCustomer.email,
            },
          },
          currency: "USD",
          subtotal,
          discountCode,
          discountAmount,
          total,
          status: "PAYMENT_PENDING",
          address: {
            address: customer.address,
            city: customer.city,
            country: customer.country,
            postalCode: customer.postalCode,
          },
          items: {
            create: orderItems,
          },
        },
        select: {
          id: true,
        },
      });

      if (discountCode) {
        await tx.discountCode.update({
          where: { code: discountCode },
          data: {
            usedCount: {
              increment: 1,
            },
          },
        });
      }

      return createdOrder;
    });

    return NextResponse.json({
      ok: true,
      order,
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: error instanceof Error ? error.message : "Order creation failed" },
      { status: 500 },
    );
  }
}
