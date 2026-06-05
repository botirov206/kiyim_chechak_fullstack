import { z } from "zod";

export const createReportSchema = z.object({
  title: z.string().min(1, "Title is required"),
  type: z.enum(["SALES", "INVENTORY", "CUSTOMER", "ORDER", "FINANCIAL"]),
  description: z.string().optional().nullable(),
  data: z.record(z.unknown()).optional().nullable(),
});

export const updateReportSchema = createReportSchema.partial();
