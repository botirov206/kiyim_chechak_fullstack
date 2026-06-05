import { z } from "zod";

export const createInventorySchema = z.object({
  productId: z.string().uuid("Invalid product ID"),
  warehouseId: z.string().uuid("Invalid warehouse ID"),
  quantity: z.coerce.number().int().min(0, "Quantity cannot be negative"),
  minStock: z.coerce.number().int().min(0).default(0),
});

export const updateInventorySchema = z.object({
  quantity: z.coerce.number().int().min(0).optional(),
  minStock: z.coerce.number().int().min(0).optional(),
});
