import { getUserById } from "@/lib/user.service";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const user = await getUserById(id);

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
