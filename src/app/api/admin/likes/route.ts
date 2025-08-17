import { NextResponse } from "next/server";
import { db, ensureSchema } from "@/lib/db";
import { likes } from "@/lib/schema";
import { desc, eq, sql } from "drizzle-orm";

export async function GET() {
  try {
    await ensureSchema();

    const totalLikes = await db.select({ count: sql<number>`count(*)` }).from(likes).where(eq(likes.itemDeleted, false));
    const totalLikesDeleted = await db.select({ count: sql<number>`count(*)` }).from(likes).where(eq(likes.itemDeleted, true));

    const recent = await db
      .select({ id: likes.id, itemId: likes.itemId, ipAddress: likes.ipAddress, userAgent: likes.userAgent, createdAt: likes.createdAt, itemDeleted: likes.itemDeleted })
      .from(likes)
      .orderBy(desc(likes.createdAt))
      .limit(100);

    const byItem = await db.execute(sql`SELECT item_id, COUNT(*)::int AS count, BOOL_OR(item_deleted) AS item_deleted FROM likes GROUP BY item_id ORDER BY count DESC LIMIT 20;`);

    return NextResponse.json({
      summary: {
        likesActive: totalLikes[0]?.count ?? 0,
        likesForDeletedItems: totalLikesDeleted[0]?.count ?? 0,
      },
      topItems: byItem.rows ?? [],
      recent,
    });
  } catch (error) {
    console.error("Error reading likes analytics:", error);
    return NextResponse.json(
      { error: "Failed to load likes analytics" },
      { status: 500 }
    );
  }
} 