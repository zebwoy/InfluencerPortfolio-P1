import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { likes, portfolioItems } from "@/lib/schema";
import { and, eq } from "drizzle-orm";

function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  const realIP = request.headers.get("x-real-ip");
  if (realIP) return realIP;
  const cfConnectingIP = request.headers.get("cf-connecting-ip");
  if (cfConnectingIP) return cfConnectingIP;
  return "unknown";
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const [item] = await db.select().from(portfolioItems).where(eq(portfolioItems.id, id)).limit(1);
    if (!item) return NextResponse.json({ error: "Item not found" }, { status: 404 });

    const allLikes = await db.select().from(likes).where(eq(likes.itemId, id));
    const likeCount = allLikes.length;

    const clientIP = getClientIP(request);
    const isLiked = allLikes.some((r) => r.ipAddress === clientIP);

    return NextResponse.json({ likeCount, isLiked });
  } catch (error) {
    console.error("Error getting likes:", error);
    return NextResponse.json(
      { error: "Failed to get like data" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { action } = await request.json();
    if (!action || !["like", "unlike"].includes(action)) {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    const clientIP = getClientIP(request);
    const userAgent = request.headers.get("user-agent") || "unknown";

    if (action === "like") {
      await db.insert(likes).values({ itemId: id, ipAddress: clientIP, userAgent });
    } else {
      // unlike: remove one like from this IP if exists
      const existing = await db.select().from(likes).where(and(eq(likes.itemId, id), eq(likes.ipAddress, clientIP))).limit(1);
      if (existing[0]) {
        // Drizzle delete requires a where; delete all matches for simplicity
        await db.delete(likes).where(and(eq(likes.itemId, id), eq(likes.ipAddress, clientIP)));
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating like:", error);
    return NextResponse.json(
      { error: "Failed to update like" },
      { status: 500 }
    );
  }
} 