import { prisma } from "./prisma";

//get user by id
export async function getUserById(id: string) {
  return await prisma.user.findUnique({
    where: { id },
    include: {
      reviews: true,
      //   Review: true,
      likedGames: true,
      likedReviews: true,
      followers: true,
      following: true,
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
      followers: true,
      following: true,
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
