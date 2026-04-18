import { NextResponse } from "next/server";
import { prisma } from "@luxe/database";
import { createOrderSchema } from "@/lib/validators/checkout";

const PRICE_TOLERANCE = 0.01;

function createOrderId() {
  return `LUX-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = createOrderSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          ok: false,
          message: "Invalid order request",
          errors: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    const { customer, lineItems, clientSubtotal } = parsed.data;
    const orderId = createOrderId();

    const createdOrder = await prisma.$transaction(async (tx) => {
      const databaseProducts = await tx.product.findMany({
        where: {
          sku: {
            in: lineItems.map((item) => item.sku),
          },
          status: "ACTIVE",
        },
        include: {
          brand: true,
          category: true,
        },
      });

      const productMap = new Map(databaseProducts.map((product) => [product.sku, product]));

      const serverItems = lineItems.map((item) => {
        const product = productMap.get(item.sku);

        if (!product) {
          throw new Error(`Product not found: ${item.sku}`);
        }

        if (item.quantity > product.stock) {
          throw new Error(`Only ${product.stock} pieces available for ${product.name}`);
        }

        const serverUnitPrice = Number(product.basePrice);

        return {
          sku: product.sku,
          name: product.name,
          slug: product.slug,
          brand: product.brand.name,
          quantity: item.quantity,
          serverUnitPrice,
          lineTotal: serverUnitPrice * item.quantity,
        };
      });

      const serverSubtotal = serverItems.reduce((sum, item) => sum + item.lineTotal, 0);

      if (Math.abs(serverSubtotal - clientSubtotal) > PRICE_TOLERANCE) {
        throw new Error("Price has changed. Please review your cart before placing the order.");
      }

      for (const item of serverItems) {
        const stockUpdate = await tx.product.updateMany({
          where: {
            sku: item.sku,
            stock: {
              gte: item.quantity,
            },
          },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });

        if (stockUpdate.count !== 1) {
          throw new Error(`Insufficient stock for ${item.name}. Please review your cart.`);
        }
      }

      const customerRecord = await tx.customer.upsert({
        where: {
          email: customer.email,
        },
        update: {
          firstName: customer.firstName,
          lastName: customer.lastName,
        },
        create: {
          email: customer.email,
          firstName: customer.firstName,
          lastName: customer.lastName,
        },
      });

      return tx.order.create({
        data: {
          id: orderId,
          customerId: customerRecord.id,
          status: "PAYMENT_PENDING",
          subtotal: serverSubtotal,
          currency: "USD",
          address: {
            address: customer.address,
            city: customer.city,
            country: customer.country,
            postalCode: customer.postalCode,
          },
          paymentRef: `pi_mock_${orderId.toLowerCase()}`,
          items: {
            create: serverItems.map((item) => ({
              productSku: item.sku,
              name: item.name,
              quantity: item.quantity,
              unitPrice: item.serverUnitPrice,
              lineTotal: item.lineTotal,
            })),
          },
        },
        include: {
          items: true,
          customer: true,
        },
      });
    });

    const mockPaymentIntent = {
      id: `pi_mock_${orderId.toLowerCase()}`,
      amount: Math.round(Number(createdOrder.subtotal) * 100),
      currency: "usd",
      status: "requires_payment_method",
    };

    return NextResponse.json({
      ok: true,
      message: "Order created successfully",
      order: createdOrder,
      paymentIntent: mockPaymentIntent,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        message: error instanceof Error ? error.message : "Order creation failed",
      },
      { status: 400 },
    );
  }
}
