import { z } from "zod";

export const adminDiscountSchema = z
  .object({
    id: z.string().optional(),
    code: z.string().min(2, "Code is required").transform((value) => value.trim().toUpperCase()),
    type: z.enum(["PERCENT", "FIXED"]),
    value: z.number().positive("Value must be greater than 0"),
    minOrderAmount: z.number().nonnegative().optional().nullable(),
    usageLimit: z.number().int().positive().optional().nullable(),
    startsAt: z.string().optional().nullable(),
    endsAt: z.string().optional().nullable(),
    isActive: z.boolean().default(true),
  })
  .refine((data) => data.type !== "PERCENT" || data.value <= 100, {
    path: ["value"],
    message: "Percentage discount cannot be more than 100",
  });

export type AdminDiscountInput = z.infer<typeof adminDiscountSchema>;
