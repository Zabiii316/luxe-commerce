export type Product = {
  sku: string;
  name: string;
  slug: string;
  brand: string;
  category: "Luxury Fashion" | "High-End Electronics" | "Luxury Accessories";
  price: number;
  comparePrice?: number;
  currency: "USD";
  shortDescription: string;
  description: string;
  materials: string[];
  features: string[];
  images: string[];
  has360Viewer: boolean;
  stock: number;
};
