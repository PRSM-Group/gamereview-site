import { prisma } from "@/lib/prisma";
import type { CreateTagInput, UpdateTagInput } from "@/lib/validations/tag";

export async function getAllTags() {
  return prisma.tag.findMany({
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
    },
  });
}

export type TagSummary = Awaited<ReturnType<typeof getAllTags>>[number];

export async function getTagById(id: string) {
  return prisma.tag.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
    },
  });
}
async function tagNameExists(name: string, excludedId?: string) {
  const tag = await prisma.tag.findFirst({
    where: {
      name: {
        equals: name,
        mode: "insensitive",
      },
      ...(excludedId ? { NOT: { id: excludedId } } : {}),
    },
    select: { id: true },
  });
  return Boolean(tag);
}
export async function createTag(data: CreateTagInput) {
  if (await tagNameExists(data.name)) {
    throw new Error("A tag with this name already exists.");
  }
  return prisma.tag.create({
    data: {
      name: data.name,
    },
  });
}
export async function updateTag(id: string, data: UpdateTagInput) {
  const existingTag = await getTagById(id);
  if (!existingTag) {
    throw new Error("Tag not found.");
  }
  if (await tagNameExists(data.name, id)) {
    throw new Error("A tag with this name already exists.");
  }
  return prisma.tag.update({
    where: { id },
    data: {
      name: data.name,
    },
  });
}

export async function deleteTag(id: string) {
  const existingTag = await getTagById(id);
  if (!existingTag) {
    throw new Error("Tag not found.");
  }
  return prisma.tag.delete({
    where: { id },
  });
}
