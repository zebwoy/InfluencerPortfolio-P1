import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { unlink } from "fs/promises";
import { db, ensureSchema } from "@/lib/db";
import { portfolioItems, likes } from "@/lib/schema";
import { and, eq } from "drizzle-orm";

const PORTFOLIO_DATA_FILE = path.join(process.cwd(), "src/data/portfolio.json");

interface PortfolioItem {
  id: string;
  type: "image" | "video";
  src: string;
  thumb?: string;
  createdAt: string;
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await ensureSchema();
    const { id } = await params;

    // Soft-mark likes as deleted
    const now = new Date().toISOString();
    await db.update(likes).set({ itemDeleted: true as unknown as any, deletedAt: now as unknown as any }).where(eq(likes.itemId, id));

    // Remove the portfolio item from DB if present
    await db.delete(portfolioItems).where(eq(portfolioItems.id, id));

    // Best effort: if the src was a local file (legacy), attempt delete
    try {
      const filePath = path.join(process.cwd(), "public", id);
      await unlink(filePath);
    } catch {}

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete item" },
      { status: 500 }
    );
  }
} 