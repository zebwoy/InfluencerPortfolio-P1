import { NextRequest, NextResponse } from "next/server";
import { db, ensureSchema } from "@/lib/db";
import { shares, portfolioItems } from "@/lib/schema";
import { eq } from "drizzle-orm";

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
  await ensureSchema();
  const { id } = await params;
  const all = await db.select().from(shares).where(eq(shares.itemId, id));
  return NextResponse.json({ shareCount: all.length });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await ensureSchema();
    const { id } = await params;
    const { method } = await request.json().catch(() => ({ method: "copy" }));

    const [item] = await db.select().from(portfolioItems).where(eq(portfolioItems.id, id)).limit(1);
    if (!item) return NextResponse.json({ error: "Item not found" }, { status: 404 });

    const clientIP = getClientIP(request);
    const userAgent = request.headers.get("user-agent") || "unknown";

    await db.insert(shares).values({ itemId: id, ipAddress: clientIP, userAgent, method });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating share:", error);
    return NextResponse.json({ error: "Failed to update share" }, { status: 500 });
  }
}