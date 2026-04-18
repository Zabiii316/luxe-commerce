import { NextResponse } from "next/server";
import { getProductsBySkus } from "@/lib/data/products";
import { checkoutValidationSchema } from "@/lib/validators/checkout";

const PRICE_TOLERANCE = 0.01;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = checkoutValidationSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          ok: false,
          message: "Invalid checkout request",
          errors: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    const { lineItems, clientSubtotal } = parsed.data;
    const databaseProducts = await getProductsBySkus(lineItems.map((item) => item.sku));

    const productMap = new Map(databaseProducts.map((product) => [product.sku, product]));

    const serverItems = lineItems.map((item) => {
      const product = productMap.get(item.sku);

      if (!product) {
        throw new Error(`Product not found: ${item.sku}`);
      }

      if (item.quantity > product.stock) {
        throw new Error(`Only ${product.stock} pieces available for ${product.name}`);
      }

      return {
        sku: product.sku,
        name: product.name,
        slug: product.slug,
        quantity: item.quantity,
        serverUnitPrice: product.price,
        lineTotal: product.price * item.quantity,
      };
    });

    const serverSubtotal = serverItems.reduce((sum, item) => sum + item.lineTotal, 0);

    if (Math.abs(serverSubtotal - clientSubtotal) > PRICE_TOLERANCE) {
      return NextResponse.json(
        {
          ok: false,
          message: "Price has changed. Please review your cart before checkout.",
          serverSubtotal,
          clientSubtotal,
        },
        { status: 409 },
      );
    }

    return NextResponse.json({
      ok: true,
      message: "Checkout validation successful",
      summary: {
        items: serverItems,
        subtotal: serverSubtotal,
        currency: "USD",
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        message: error instanceof Error ? error.message : "Checkout validation failed",
      },
      { status: 400 },
    );
  }
}
