import { NextResponse } from "next/server";
import { prisma } from "@luxe/database";
import { adminProductSchema } from "@/lib/validators/admin-product";

type RouteContext = {
  params: Promise<{
    sku: string;
  }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { sku } = await context.params;
    const body = await request.json();

    const parsed = adminProductSchema.safeParse({
      ...body,
      sku,
    });

    if (!parsed.success) {
      return NextResponse.json(
        {
          ok: false,
          message: "Invalid product data",
          errors: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    const data = parsed.data;

    const slugConflict = await prisma.product.findFirst({
      where: {
        slug: data.slug,
        NOT: {
          sku,
        },
      },
    });

    if (slugConflict) {
      return NextResponse.json(
        {
          ok: false,
          message: "Another product already uses this slug.",
        },
        { status: 409 },
      );
    }

    const product = await prisma.product.update({
      where: {
        sku,
      },
      data: {
        name: data.name,
        slug: data.slug,
        brandId: data.brandId,
        categoryId: data.categoryId,
        basePrice: data.basePrice,
        comparePrice: data.comparePrice ?? null,
        currency: data.currency,
        shortDescription: data.shortDescription,
        description: data.description,
        materials: data.materials,
        features: data.features,
        images: data.images,
        has360Viewer: data.has360Viewer,
        stock: data.stock,
        status: data.status,
      },
    });

    return NextResponse.json({
      ok: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        message: error instanceof Error ? error.message : "Product update failed",
      },
      { status: 500 },
    );
  }
}
