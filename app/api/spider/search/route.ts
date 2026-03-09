import { NextRequest, NextResponse } from "next/server";
import { search } from "@/lib/spider-search";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.slice(0, 200) || "";
  const page = Math.max(1, Number(req.nextUrl.searchParams.get("page")) || 1);

  if (!q.trim()) {
    return NextResponse.json({
      query: "",
      results: [],
      featured: [],
      total: 0,
      time_ms: 0,
      page: 1,
      per_page: 20,
    });
  }

  const result = await search(q, page);
  return NextResponse.json(result);
}
