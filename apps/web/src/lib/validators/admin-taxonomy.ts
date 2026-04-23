import { z } from "zod";

export const adminTaxonomySchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, "Name is required"),
  slug: z
    .string()
    .min(2, "Slug is required")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use a valid URL slug"),
});

export type AdminTaxonomyInput = z.infer<typeof adminTaxonomySchema>;
