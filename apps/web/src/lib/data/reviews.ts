import { prisma } from "@luxe/database";

export type ProductReview = {
  id: string;
  name: string;
  rating: number;
  title: string;
  comment: string;
  createdAt: string;
};

export async function getProductReviewsBySlug(slug: string): Promise<ProductReview[]> {
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
    return [];
  }

  return product.reviews.map((review) => ({
    ...review,
    createdAt: review.createdAt.toISOString(),
  }));
}
