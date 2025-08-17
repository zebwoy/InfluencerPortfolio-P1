import { pgTable, text, timestamp, bigserial, boolean } from "drizzle-orm/pg-core";

export const portfolioItems = pgTable("portfolio_items", {
  id: text("id").primaryKey(),
  type: text("type").notNull(), // 'image' | 'video'
  src: text("src").notNull(),
  thumb: text("thumb"),
  createdAt: timestamp("created_at", { withTimezone: false }).notNull().defaultNow(),
});

export const likes = pgTable("likes", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  itemId: text("item_id").notNull(),
  ipAddress: text("ip_address").notNull(),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at", { withTimezone: false }).notNull().defaultNow(),
  itemDeleted: boolean("item_deleted").notNull().default(false),
  deletedAt: timestamp("deleted_at", { withTimezone: false }),
});

export const shares = pgTable("shares", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  itemId: text("item_id").notNull(),
  ipAddress: text("ip_address").notNull(),
  userAgent: text("user_agent"),
  method: text("method"), // 'native' | 'copy'
  createdAt: timestamp("created_at", { withTimezone: false }).notNull().defaultNow(),
  itemDeleted: boolean("item_deleted").notNull().default(false),
  deletedAt: timestamp("deleted_at", { withTimezone: false }),
});