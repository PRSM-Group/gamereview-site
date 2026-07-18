"use server";

import { revalidatePath } from "next/cache";
import { UserRole } from "@/generated/prisma/client";
import { requireAdmin } from "@/lib/auth-helpers";
import { ROLES, type Role } from "@/lib/admin-mock";
import { getUsersForAdmin, updateUserRole } from "@/services/user.service";

export interface ActionResult {
  success: boolean;
  message: string;
}

export async function updateUserRoleAction(
  userId: string,
  role: Role,
): Promise<ActionResult> {
  try {
    const session = await requireAdmin();

    if (!ROLES.includes(role)) {
      return { success: false, message: "Invalid role." };
    }

    if (userId === session.user.id && role !== UserRole.ADMIN) {
      return {
        success: false,
        message: "You cannot remove your own admin access.",
      };
    }

    await updateUserRole(userId, role as UserRole);
    revalidatePath("/admin");

    return { success: true, message: "User role updated." };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not update user role.";
    return { success: false, message };
  }
}

export async function getUsersForAdminAction() {
  await requireAdmin();
  return getUsersForAdmin();
}
