import { z } from "zod";

const orderItemSchema = z.object({
  productId: z.string().uuid("Invalid product ID"),
  quantity: z.coerce.number().int().positive("Quantity must be positive"),
});

export const createOrderSchema = z.object({
  customerId: z.string().uuid("Invalid customer ID"),
  status: z
    .enum(["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"])
    .default("PENDING"),
  notes: z.string().optional().nullable(),
  items: z.array(orderItemSchema).min(1, "At least one order item is required"),
});

export const updateOrderSchema = z.object({
  customerId: z.string().uuid().optional(),
  status: z
    .enum(["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"])
    .optional(),
  notes: z.string().optional().nullable(),
});
