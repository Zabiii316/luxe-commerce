import { z } from "zod";

export const adminProductSchema = z.object({
  sku: z.string().min(3, "SKU is required"),
  name: z.string().min(3, "Product name is required"),
  slug: z
    .string()
    .min(3, "Slug is required")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use a valid URL slug"),
  brandId: z.string().min(1, "Brand is required"),
  categoryId: z.string().min(1, "Category is required"),
  basePrice: z.number().positive("Price must be greater than 0"),
  comparePrice: z.number().positive().optional().nullable(),
  currency: z.literal("USD"),
  shortDescription: z.string().min(10, "Short description is required"),
  description: z.string().min(20, "Description is required"),
  materials: z.array(z.string().min(1)).default([]),
  features: z.array(z.string().min(1)).default([]),
  images: z.array(z.string().min(1)).default([]),
  has360Viewer: z.boolean().default(false),
  stock: z.number().int().min(0, "Stock cannot be negative"),
  status: z.enum(["ACTIVE", "DRAFT", "ARCHIVED"]),
});

export type AdminProductInput = z.infer<typeof adminProductSchema>;
