import { prisma } from "@/lib/prisma";

export async function getAllTags() {
  return prisma.tag.findMany({
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
    },
  });
}
