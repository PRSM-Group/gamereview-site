"use server";

import { revalidatePath } from "next/cache";
import {
  createGame,
  deleteGame,
  getGameById,
  updateGame,
} from "@/services/game.service";
import {
  createGameSchema,
  type CreateGameInput,
  updateGameSchema,
  type UpdateGameInput,
} from "@/lib/validations/game";
import { requireAdmin } from "@/lib/auth-helpers";

export interface ActionResult {
  success: boolean;
  message: string;
  fieldErrors?: Record<string, string>;
}

export async function createGameAction(
  data: CreateGameInput,
): Promise<ActionResult> {
  await requireAdmin();

  // data validation
  const validated = createGameSchema.safeParse(data); // lets use safeparse so we can return the error message to the user instead of throwing an error
  if (!validated.success) {
    return {
      success: false,
      message: validated.error.issues[0]?.message ?? "Invalid input.",
    };
  }

  // only pass validated data
  await createGame(validated.data);

  // refresh
  revalidatePath("/admin");
  revalidatePath("/");
  // add more to revalidate like browser cache or other paths if needed

  return {
    success: true,
    message: "Game created successfully.",
  };
}

export async function updateGameAction(
  id: string,
  data: UpdateGameInput,
): Promise<ActionResult> {
  await requireAdmin();

  const validated = updateGameSchema.safeParse(data);
  if (!validated.success) {
    return {
      success: false,
      message: validated.error.issues[0]?.message ?? "Invalid input.",
    };
  }

  await updateGame(id, validated.data);

  revalidatePath("/admin");
  revalidatePath("/");
  revalidatePath(`/games/${id}`);

  return {
    success: true,
    message: "Game updated successfully.",
  };
}

export async function deleteGameAction(id: string): Promise<ActionResult> {
  await requireAdmin();

  await deleteGame(id);

  revalidatePath("/admin");
  revalidatePath("/");
  return {
    success: true,
    message: "Game deleted successfully.",
  };
}
