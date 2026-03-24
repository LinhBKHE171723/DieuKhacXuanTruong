import { z } from "zod";

export const pageUpdateSchema = z.object({
  body: z.object({
    title: z.string().min(2),
    heroTitle: z.string().optional().default(""),
    heroSubtitle: z.string().optional().default(""),
    content: z.string().optional().default(""),
    sections: z.record(z.any()).optional().default({}),
    metaTitle: z.string().optional().default(""),
    metaDescription: z.string().optional().default(""),
    isPublished: z.coerce.boolean().optional().default(true)
  }),
  params: z.object({
    slug: z.string()
  }),
  query: z.object({}).optional()
});
