import { z } from "zod";

export const createCustomerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email").optional().nullable(),
  phone: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  company: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
});

export const updateCustomerSchema = createCustomerSchema.partial();
