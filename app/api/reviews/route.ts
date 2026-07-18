import { NextRequest, NextResponse } from "next/server";
import {
  createReview,
  getAllReviews,
  getReviewsByGameId,
} from "@/services/review.service";
import { createReviewSchema } from "@/lib/validations/review";

export async function GET(request: NextRequest) {
  try {
    const gameId = request.nextUrl.searchParams.get("gameId");
    const reviews = gameId
      ? await getReviewsByGameId(gameId)
      : await getAllReviews();
    return NextResponse.json(reviews);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch reviews." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = createReviewSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        {
          error: validated.error.issues[0]?.message ?? "Invalid input.",
          issues: validated.error.issues,
        },
        { status: 400 },
      );
    }

    const review = await createReview(validated.data);
    return NextResponse.json(review, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create review." },
      { status: 500 },
    );
  }
}
