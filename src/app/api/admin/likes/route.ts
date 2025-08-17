import { NextResponse } from "next/server";
import { db, ensureSchema } from "@/lib/db";
import { likes, shares } from "@/lib/schema";
import { desc, eq, sql } from "drizzle-orm";

export async function GET() {
  try {
    await ensureSchema();

    const totalLikes = await db.select({ count: sql<number>`count(*)` }).from(likes).where(eq(likes.itemDeleted, false));
    const totalLikesDeleted = await db.select({ count: sql<number>`count(*)` }).from(likes).where(eq(likes.itemDeleted, true));

    const totalShares = await db.select({ count: sql<number>`count(*)` }).from(shares).where(eq(shares.itemDeleted, false));
    const totalSharesDeleted = await db.select({ count: sql<number>`count(*)` }).from(shares).where(eq(shares.itemDeleted, true));

    const recentLikes = await db
      .select({ id: likes.id, itemId: likes.itemId, ipAddress: likes.ipAddress, userAgent: likes.userAgent, createdAt: likes.createdAt, itemDeleted: likes.itemDeleted })
      .from(likes)
      .orderBy(desc(likes.createdAt))
      .limit(100);

    const recentShares = await db
      .select({ id: shares.id, itemId: shares.itemId, ipAddress: shares.ipAddress, userAgent: shares.userAgent, method: shares.method, createdAt: shares.createdAt, itemDeleted: shares.itemDeleted })
      .from(shares)
      .orderBy(desc(shares.createdAt))
      .limit(100);

    const topLiked = await db.execute(sql`SELECT item_id, COUNT(*)::int AS count, BOOL_OR(item_deleted) AS item_deleted FROM likes GROUP BY item_id ORDER BY count DESC LIMIT 20;`);
    const topShared = await db.execute(sql`SELECT item_id, COUNT(*)::int AS count, BOOL_OR(item_deleted) AS item_deleted FROM shares GROUP BY item_id ORDER BY count DESC LIMIT 20;`);

    return NextResponse.json({
      summary: {
        likesActive: totalLikes[0]?.count ?? 0,
        likesForDeletedItems: totalLikesDeleted[0]?.count ?? 0,
        sharesActive: totalShares[0]?.count ?? 0,
        sharesForDeletedItems: totalSharesDeleted[0]?.count ?? 0,
      },
      topItems: topLiked.rows ?? [],
      topShared: topShared.rows ?? [],
      recent: recentLikes,
      recentShares,
    });
  } catch (error) {
    console.error("Error reading likes analytics:", error);
    return NextResponse.json(
      { error: "Failed to load likes analytics" },
      { status: 500 }
    );
  }
} 