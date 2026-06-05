import { z } from "zod";

export const createProductSchema = z.object({
  sku: z.string().min(1, "SKU is required"),
  name: z.string().min(1, "Name is required"),
  description: z.string().optional().nullable(),
  price: z.coerce.number().positive("Price must be positive"),
  category: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
});

export const updateProductSchema = createProductSchema.partial();
