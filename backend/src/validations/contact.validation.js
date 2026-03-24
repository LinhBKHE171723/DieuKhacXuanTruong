import { z } from "zod";
import { objectIdSchema } from "./common.validation.js";

export const contactCreateSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    phone: z.string().optional().default(""),
    email: z.string().email().optional().or(z.literal("")),
    subject: z.string().optional().default(""),
    message: z.string().min(10)
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional()
});

export const contactStatusSchema = z.object({
  body: z.object({
    status: z.enum(["NEW", "PROCESSED"]),
    notes: z.string().optional().default("")
  }),
  params: z.object({
    id: objectIdSchema
  }),
  query: z.object({}).optional()
});
