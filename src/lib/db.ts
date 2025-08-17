import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
	throw new Error("DATABASE_URL is not set. Configure it in Netlify env and .env.local");
}

export const sql = neon(connectionString);
export const db = drizzle(sql);
export type DB = typeof db;

export async function ensureSchema(): Promise<void> {
	// Create tables if they don't exist
	await sql`
		CREATE TABLE IF NOT EXISTS portfolio_items (
			id TEXT PRIMARY KEY,
			type TEXT NOT NULL CHECK (type IN ('image','video')),
			src TEXT NOT NULL,
			thumb TEXT,
			created_at TIMESTAMP NOT NULL DEFAULT NOW()
		);
	`;
	await sql`
		CREATE TABLE IF NOT EXISTS likes (
			id BIGSERIAL PRIMARY KEY,
			item_id TEXT NOT NULL,
			ip_address TEXT NOT NULL,
			user_agent TEXT,
			created_at TIMESTAMP NOT NULL DEFAULT NOW(),
			item_deleted BOOLEAN NOT NULL DEFAULT FALSE,
			deleted_at TIMESTAMP
		);
	`;
	await sql`ALTER TABLE likes ADD COLUMN IF NOT EXISTS item_deleted BOOLEAN NOT NULL DEFAULT FALSE;`;
	await sql`ALTER TABLE likes ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP NULL;`;
	try { await sql`ALTER TABLE likes DROP CONSTRAINT IF EXISTS likes_item_id_fkey;`; } catch {}

	await sql`
		CREATE TABLE IF NOT EXISTS shares (
			id BIGSERIAL PRIMARY KEY,
			item_id TEXT NOT NULL,
			ip_address TEXT NOT NULL,
			user_agent TEXT,
			method TEXT,
			created_at TIMESTAMP NOT NULL DEFAULT NOW(),
			item_deleted BOOLEAN NOT NULL DEFAULT FALSE,
			deleted_at TIMESTAMP
		);
	`;
	await sql`ALTER TABLE shares ADD COLUMN IF NOT EXISTS item_deleted BOOLEAN NOT NULL DEFAULT FALSE;`;
	await sql`ALTER TABLE shares ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP NULL;`;
	try { await sql`ALTER TABLE shares DROP CONSTRAINT IF EXISTS shares_item_id_fkey;`; } catch {}
}