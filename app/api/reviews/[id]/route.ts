import { NextResponse } from "next/server";
import {
  deleteReview,
  getReviewById,
  updateReview,
} from "@/services/review.service";
import { updateReviewSchema } from "@/lib/validations/review";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const review = await getReviewById(id);

    if (!review) {
      return NextResponse.json({ error: "Review not found." }, { status: 404 });
    }

    return NextResponse.json(review);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch review." },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validated = updateReviewSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        {
          error: validated.error.issues[0]?.message ?? "Invalid input.",
          issues: validated.error.issues,
        },
        { status: 400 },
      );
    }

    const review = await updateReview(id, validated.data);
    return NextResponse.json(review);
  } catch (error) {
    if (error instanceof Error && error.message === "Review not found") {
      return NextResponse.json({ error: "Review not found." }, { status: 404 });
    }
    return NextResponse.json(
      { error: "Failed to update review." },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    await deleteReview(id);
    return NextResponse.json({ message: "Review deleted successfully." });
  } catch (error) {
    if (error instanceof Error && error.message === "Review not found") {
      return NextResponse.json({ error: "Review not found." }, { status: 404 });
    }
    return NextResponse.json(
      { error: "Failed to delete review." },
      { status: 500 },
    );
  }
}
