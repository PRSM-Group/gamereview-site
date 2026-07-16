import { NextResponse } from "next/server";
import { getAllGames, createGame } from "@/services/game.service";

export async function GET() {
  const games = await getAllGames();
  return NextResponse.json(games);
}

export async function POST(request: Request) {
  const data = await request.json();
  const game = await createGame(data);
  return NextResponse.json(game);
}
