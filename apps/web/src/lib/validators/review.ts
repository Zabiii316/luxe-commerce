import { z } from "zod";

export const productReviewSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Enter a valid email").optional().or(z.literal("")),
  rating: z.number().int().min(1).max(5),
  title: z.string().min(3, "Review title is required"),
  comment: z.string().min(10, "Review comment must be at least 10 characters"),
});

export type ProductReviewInput = z.infer<typeof productReviewSchema>;
