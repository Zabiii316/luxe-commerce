import { z } from "zod";

export const checkoutLineItemSchema = z.object({
  sku: z.string().min(1, "Product SKU is required"),
  quantity: z.number().int().positive("Quantity must be at least 1"),
  clientUnitPrice: z.number().nonnegative("Invalid unit price"),
});

export const checkoutValidationSchema = z.object({
  lineItems: z.array(checkoutLineItemSchema).min(1, "Cart is empty"),
  clientSubtotal: z.number().nonnegative("Invalid subtotal"),
});

export const checkoutCustomerSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  address: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  country: z.string().min(2, "Country is required"),
  postalCode: z.string().min(3, "Postal code is required"),
});

export const createOrderSchema = checkoutValidationSchema.extend({
  customer: checkoutCustomerSchema,
});

export type CheckoutCustomerInput = z.infer<typeof checkoutCustomerSchema>;
export type CreateOrderInput = z.infer<typeof createOrderSchema>;
