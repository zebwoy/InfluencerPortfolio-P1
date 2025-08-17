import { NextRequest, NextResponse } from "next/server";
import { db, ensureSchema } from "@/lib/db";
import { portfolioItems, likes, shares } from "@/lib/schema";
import { eq } from "drizzle-orm";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await ensureSchema();
    const { id } = await params;

    // Soft-mark likes & shares as deleted
    await db.update(likes).set({ itemDeleted: true, deletedAt: new Date() }).where(eq(likes.itemId, id));
    await db.update(shares).set({ itemDeleted: true, deletedAt: new Date() }).where(eq(shares.itemId, id));

    // Remove the portfolio item from DB
    await db.delete(portfolioItems).where(eq(portfolioItems.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete item" },
      { status: 500 }
    );
  }
} 