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
	// Attempt to drop ON DELETE CASCADE FK if it exists, to retain likes after item deletion
	try {
		await sql`ALTER TABLE likes DROP CONSTRAINT IF EXISTS likes_item_id_fkey;`;
	} catch {}
	// Optionally, do not recreate FK to allow orphaned likes; if you want a FK without cascade, uncomment below
	// try { await sql`ALTER TABLE likes ADD CONSTRAINT likes_item_id_fkey FOREIGN KEY (item_id) REFERENCES portfolio_items(id);`; } catch {}
}