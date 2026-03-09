import { NextRequest, NextResponse } from "next/server";
import { suggest } from "@/lib/spider-search";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.slice(0, 100) || "";
  const results = await suggest(q);
  return NextResponse.json(results);
}
