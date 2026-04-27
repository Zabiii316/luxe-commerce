import { NextResponse } from "next/server";
import { prisma } from "@luxe/database";
import { productReviewSchema } from "@/lib/validators/review";

type RouteContext = {
  params: Promise<{
    slug: string;
  }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { slug } = await context.params;

  const product = await prisma.product.findUnique({
    where: {
      slug,
    },
    select: {
      reviews: {
        where: {
          isApproved: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          name: true,
          rating: true,
          title: true,
          comment: true,
          createdAt: true,
        },
      },
    },
  });

  if (!product) {
    return NextResponse.json(
      {
        ok: false,
        message: "Product not found",
      },
      { status: 404 },
    );
  }

  return NextResponse.json({
    ok: true,
    reviews: product.reviews.map((review) => ({
      ...review,
      createdAt: review.createdAt.toISOString(),
    })),
  });
}

export async function POST(request: Request, context: RouteContext) {
  try {
    const { slug } = await context.params;
    const body = await request.json();

    const parsed = productReviewSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          ok: false,
          message: "Invalid review data",
          errors: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    const product = await prisma.product.findUnique({
      where: {
        slug,
      },
      select: {
        sku: true,
      },
    });

    if (!product) {
      return NextResponse.json(
        {
          ok: false,
          message: "Product not found",
        },
        { status: 404 },
      );
    }

    const review = await prisma.review.create({
      data: {
        productSku: product.sku,
        name: parsed.data.name,
        email: parsed.data.email || null,
        rating: parsed.data.rating,
        title: parsed.data.title,
        comment: parsed.data.comment,
        isApproved: true,
      },
      select: {
        id: true,
        name: true,
        rating: true,
        title: true,
        comment: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      ok: true,
      review: {
        ...review,
        createdAt: review.createdAt.toISOString(),
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        message: error instanceof Error ? error.message : "Review submission failed",
      },
      { status: 500 },
    );
  }
}
