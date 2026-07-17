import { prisma } from "@/lib/prisma";
import { getUserByUsername, updateUser } from "@/lib/user.service";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const user = await getUserByUsername(id);

    if (!user)
      return NextResponse.json({ error: "User not found. " }, { status: 404 });

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const allowedFields = ["displayName", "bio", "username", "profileImage"];
    const invalidFields = Object.keys(body).filter(
      (key) => !allowedFields.includes(key),
    );

    if (invalidFields.length > 0) {
      return NextResponse.json(
        { error: `Invalid fields: ${invalidFields.join(", ")}` },
        { status: 400 },
      );
    }

    const existing = await getUserByUsername(id);
    if (!existing) {
      return NextResponse.json({ error: "User not found." }, { status: 400 });
    }

    if (body.username && body.username !== existing.username) {
      const taken = await prisma.user.findUnique({
        where: { username: body.username },
      });
      if (taken) {
        return NextResponse.json(
          { error: "Username already taken." },
          { status: 409 },
        );
      }
    }

    const updated = await updateUser(id, body);
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update user. " },
      { status: 500 },
    );
  }
}
