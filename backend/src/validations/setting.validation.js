import { z } from "zod";

export const settingsUpdateSchema = z.object({
  body: z.record(z.any()),
  params: z.object({}).optional(),
  query: z.object({}).optional()
});
