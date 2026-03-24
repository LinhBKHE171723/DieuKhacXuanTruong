import { z } from "zod";
import { objectIdSchema } from "./common.validation.js";

const imageSchema = z.object({
  url: z.string().url(),
  key: z.string().optional().nullable(),
  altText: z.string().optional().default(""),
  sortOrder: z.coerce.number().optional().default(0),
  isPrimary: z.coerce.boolean().optional().default(false)
});

const dimensionsSchema = z.union([z.string(), z.array(z.string())]);

const productBody = z.object({
  categoryId: objectIdSchema,
  name: z.string().trim().min(2, "Tên sản phẩm phải có ít nhất 2 ký tự."),
  slug: z.string().optional().default(""),
  shortDescription: z.string().trim().min(10, "Mô tả ngắn phải có ít nhất 10 ký tự."),
  content: z.string().optional().default(""),
  material: z.string().optional().default(""),
  dimensions: dimensionsSchema.optional().default(""),
  tags: z.array(z.string()).optional().default([]),
  images: z.array(imageSchema).optional().default([]),
  isFeatured: z.coerce.boolean().optional().default(false),
  isVisible: z.coerce.boolean().optional().default(true),
  sortOrder: z.coerce.number().optional().default(0),
  metaTitle: z.string().optional().default(""),
  metaDescription: z.string().optional().default("")
});

export const productCreateSchema = z.object({
  body: productBody,
  params: z.object({}).optional(),
  query: z.object({}).optional()
});

export const productUpdateSchema = z.object({
  body: productBody,
  params: z.object({
    id: objectIdSchema
  }),
  query: z.object({}).optional()
});
