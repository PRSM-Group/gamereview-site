import { UserRole } from "@/generated/prisma/client";
import { prisma } from "../lib/prisma";

export type AdminUserSummary = {
  id: string;
  username: string;
  displayName: string;
  email: string;
  role: UserRole;
  createdAt: Date;
};

//get user by id
export async function getUserById(id: string) {
  return await prisma.user.findUnique({
    where: { id },
    include: {
      reviews: true,
      likedGames: true,
      likedReviews: true,
      // followers: true,
      // following: true,
      flaggedReviews: true,
    },
  });
}

//get user by username
export async function getUserByUsername(username: string) {
  return await prisma.user.findUnique({
    where: { username },
    include: {
      reviews: true,
      likedGames: true,
    },
  });
}

//get all users
export async function getAllUsers() {
  return await prisma.user.findMany({
    select: {
      id: true,
      displayName: true,
      username: true,
      profileImage: true,
      bio: true,
    },
  });
}

export async function getUsersForAdmin(): Promise<AdminUserSummary[]> {
  return prisma.user.findMany({
    select: {
      id: true,
      username: true,
      displayName: true,
      email: true,
      role: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function updateUserRole(id: string, role: UserRole) {
  return prisma.user.update({
    where: { id },
    data: { role },
    select: {
      id: true,
      role: true,
    },
  });
}

//update user profile
export async function updateUser(
  id: string,
  data: {
    displayName?: string;
    username?: string;
    bio?: string;
    profileImage?: string;
  },
) {
  return await prisma.user.update({
    where: { id },
    data,
  });
}

//delete user
export async function deleteUser(id: string) {
  return await prisma.user.delete({
    where: { id },
  });
}
