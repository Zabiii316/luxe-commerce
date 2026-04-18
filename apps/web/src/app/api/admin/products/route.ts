import { NextResponse } from "next/server";
import { prisma } from "@luxe/database";
import { adminProductSchema } from "@/lib/validators/admin-product";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = adminProductSchema.safeParse(body);

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

    const existingProduct = await prisma.product.findFirst({
      where: {
        OR: [{ sku: data.sku }, { slug: data.slug }],
      },
    });

    if (existingProduct) {
      return NextResponse.json(
        {
          ok: false,
          message: "A product with this SKU or slug already exists.",
        },
        { status: 409 },
      );
    }

    const product = await prisma.product.create({
      data: {
        sku: data.sku,
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
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        message: error instanceof Error ? error.message : "Product creation failed",
      },
      { status: 500 },
    );
  }
}
