import { z } from "zod";
import { ReviewStatus, Recommendation } from "@/generated/prisma/client";

export const createReviewSchema = z.object({
  heading: z
    .string()
    .trim()
    .min(1, { message: "Heading is required" })
    .max(100, { message: "Heading must not exceed 100 characters" }),
  content: z
    .string()
    .trim()
    .min(1, { message: "Content is required" })
    .max(4000, { message: "Content must not exceed 4000 characters" }),
  rating: z
    .number()
    .min(0.5, { message: "Rating must be at least 0.5" })
    .max(5, { message: "Rating must not exceed 5" }),
  status: z.nativeEnum(ReviewStatus),
  recommendation: z.nativeEnum(Recommendation),
  containsSpoilers: z.boolean(),
  userId: z.string(),
  gameId: z.string(),
  flaggedBy: z.array(z.string()).optional(),
  likedBy: z.array(z.string()).optional(),
});

export type CreateReviewInput = z.infer<typeof createReviewSchema>;

export const updateReviewSchema = createReviewSchema;

export type UpdateReviewInput = z.infer<typeof updateReviewSchema>;
