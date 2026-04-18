import { Prisma, prisma } from "@luxe/database";
import type { Product } from "@/lib/types/product";

const productWithRelations = Prisma.validator<Prisma.ProductDefaultArgs>()({
  include: {
    brand: true,
    category: true,
  },
});

type ProductWithRelations = Prisma.ProductGetPayload<typeof productWithRelations>;

function toCategoryName(categoryName: string): Product["category"] {
  const allowedCategories: Product["category"][] = [
    "Luxury Fashion",
    "High-End Electronics",
    "Luxury Accessories",
  ];

  if (allowedCategories.includes(categoryName as Product["category"])) {
    return categoryName as Product["category"];
  }

  return "Luxury Accessories";
}

function mapDatabaseProduct(product: ProductWithRelations): Product {
  return {
    sku: product.sku,
    name: product.name,
    slug: product.slug,
    brand: product.brand.name,
    category: toCategoryName(product.category.name),
    price: Number(product.basePrice),
    comparePrice: product.comparePrice ? Number(product.comparePrice) : undefined,
    currency: product.currency as Product["currency"],
    shortDescription: product.shortDescription,
    description: product.description,
    materials: product.materials,
    features: product.features,
    images: product.images,
    has360Viewer: product.has360Viewer,
    stock: product.stock,
  };
}

export async function getProducts() {
  const products = await prisma.product.findMany({
    where: {
      status: "ACTIVE",
    },
    include: {
      brand: true,
      category: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  return products.map(mapDatabaseProduct);
}

export async function getFeaturedProducts(limit = 3) {
  const products = await prisma.product.findMany({
    where: {
      status: "ACTIVE",
    },
    include: {
      brand: true,
      category: true,
    },
    orderBy: {
      createdAt: "asc",
    },
    take: limit,
  });

  return products.map(mapDatabaseProduct);
}

export async function getProductBySlug(slug: string) {
  const product = await prisma.product.findUnique({
    where: {
      slug,
    },
    include: {
      brand: true,
      category: true,
    },
  });

  return product ? mapDatabaseProduct(product) : null;
}

export async function getProductsBySkus(skus: string[]) {
  const products = await prisma.product.findMany({
    where: {
      sku: {
        in: skus,
      },
      status: "ACTIVE",
    },
    include: {
      brand: true,
      category: true,
    },
  });

  return products.map(mapDatabaseProduct);
}
