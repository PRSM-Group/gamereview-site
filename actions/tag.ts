"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth-helpers";
import {
  createTagSchema,
  type CreateTagInput,
  updateTagSchema,
  type UpdateTagInput,
} from "@/lib/validations/tag";
import { createTag, deleteTag, updateTag } from "@/services/tag.service";

export interface TagActionResult {
  success: boolean;
  message: string;
}

function revalidateTagPages() {
  revalidatePath("/admin");
  revalidatePath("/browse");
  revalidatePath("/");
}

function getTagErrorMessage(error: unknown, fallback: string) {
  if (
    error instanceof Error &&
    (error.message === "Tag not found." ||
      error.message === "A tag with this name already exists.")
  ) {
    return error.message;
  }

  return fallback;
}

export async function createTagAction(
  data: CreateTagInput,
): Promise<TagActionResult> {
  await requireAdmin();

  const validated = createTagSchema.safeParse(data);
  if (!validated.success) {
    return {
      success: false,
      message: validated.error.issues[0]?.message ?? "Invalid input.",
    };
  }

  try {
    await createTag(validated.data);
    revalidateTagPages();

    return {
      success: true,
      message: "Tag created successfully.",
    };
  } catch (error) {
    return {
      success: false,
      message: getTagErrorMessage(error, "Unable to create tag."),
    };
  }
}

export async function updateTagAction(
  id: string,
  data: UpdateTagInput,
): Promise<TagActionResult> {
  await requireAdmin();

  const validated = updateTagSchema.safeParse(data);
  if (!validated.success) {
    return {
      success: false,
      message: validated.error.issues[0]?.message ?? "Invalid input.",
    };
  }

  try {
    await updateTag(id, validated.data);
    revalidateTagPages();

    return {
      success: true,
      message: "Tag updated successfully.",
    };
  } catch (error) {
    return {
      success: false,
      message: getTagErrorMessage(error, "Unable to update tag."),
    };
  }
}

export async function deleteTagAction(id: string): Promise<TagActionResult> {
  await requireAdmin();

  try {
    await deleteTag(id);
    revalidateTagPages();

    return {
      success: true,
      message: "Tag deleted successfully.",
    };
  } catch (error) {
    return {
      success: false,
      message: getTagErrorMessage(error, "Unable to delete tag."),
    };
  }
}
