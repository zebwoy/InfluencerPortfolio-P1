import { NextResponse } from "next/server";
import { db, ensureSchema } from "@/lib/db";
import { portfolioItems } from "@/lib/schema";
import { desc } from "drizzle-orm";

export async function GET() {
  try {
    await ensureSchema();
    const items = await db.select().from(portfolioItems).orderBy(desc(portfolioItems.createdAt));
    return NextResponse.json({ items });
  } catch (error) {
    console.error("Error reading portfolio data:", error);
    return NextResponse.json(
      { error: "Failed to load portfolio data" },
      { status: 500 }
    );
  }
} 