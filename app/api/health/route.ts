import { NextResponse } from "next/server";
import { getSupabaseConfig } from "@/lib/supabase/env";

export async function GET() {
  const supabase = getSupabaseConfig();
  const hasDatabase = Boolean(process.env.DATABASE_URL?.trim());

  return NextResponse.json({
    ok: Boolean(supabase && hasDatabase),
    supabase: Boolean(supabase),
    database: hasDatabase,
  });
}
