import { z } from "zod";
import { Genre, Platform } from "@/generated/prisma/client";

export const createGameSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, { message: "Title is required" })
    .max(150, { message: "Title must not exceed 150 characters" }),
  description: z
    .string()
    .trim()
    .min(1, { message: "Description is required" })
    .max(5000, { message: "Description must not exceed 5000 characters" }),
  developer: z
    .string()
    .trim()
    .min(1, { message: "Developer is required" })
    .max(100, { message: "Developer must not exceed 100 characters" }),
  releaseDate: z.coerce.date(),
  coverImage: z.string(),
  bannerImage: z.string(),
  genres: z
    .array(z.nativeEnum(Genre))
    .min(1, { message: "Select at least one genre" })
    .max(5, { message: "You can select up to 5 genres" }),
  platforms: z
    .array(z.nativeEnum(Platform))
    .min(1, { message: "Select at least one platform" }),
  tagIds: z
    .array(z.string())
    .min(1, { message: "Select at least one tag" })
    .max(10, { message: "You can select up to 10 tags" }),
});

export type CreateGameInput = z.infer<typeof createGameSchema>;

export const updateGameSchema = createGameSchema;

export type UpdateGameInput = z.infer<typeof updateGameSchema>;
