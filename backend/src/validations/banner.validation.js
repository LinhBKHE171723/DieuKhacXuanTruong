import { z } from "zod";
import { objectIdSchema } from "./common.validation.js";

const bannerBody = z.object({
  imageUrl: z.string().url(),
  imageKey: z.string().optional().nullable(),
  sortOrder: z.coerce.number().optional().default(0),
  isActive: z.coerce.boolean().optional().default(true),
  isFeatured: z.coerce.boolean().optional().default(false)
});

export const bannerCreateSchema = z.object({
  body: bannerBody,
  params: z.object({}).optional(),
  query: z.object({}).optional()
});

export const bannerUpdateSchema = z.object({
  body: bannerBody,
  params: z.object({
    id: objectIdSchema
  }),
  query: z.object({}).optional()
});

export const bannerReorderSchema = z.object({
  body: z.object({
    items: z.array(
      z.object({
        id: objectIdSchema,
        sortOrder: z.coerce.number().min(0)
      })
    )
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional()
});
