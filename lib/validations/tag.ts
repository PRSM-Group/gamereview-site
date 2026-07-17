import { z } from "zod";

export const createTagSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: "Tag name is required" })
    .max(50, { message: "Tag name must not exceed 50 characters" }),
});

export type CreateTagInput = z.infer<typeof createTagSchema>;

export const updateTagSchema = createTagSchema;

export type UpdateTagInput = z.infer<typeof updateTagSchema>;
