import { z } from "zod";

export const createWarehouseSchema = z.object({
  name: z.string().min(1, "Name is required"),
  code: z.string().min(1, "Code is required"),
  location: z.string().optional().nullable(),
  capacity: z.coerce.number().int().positive().optional().nullable(),
  isActive: z.boolean().default(true),
});

export const updateWarehouseSchema = createWarehouseSchema.partial();
