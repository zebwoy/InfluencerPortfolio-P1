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
			item_id TEXT NOT NULL REFERENCES portfolio_items(id) ON DELETE CASCADE,
			ip_address TEXT NOT NULL,
			user_agent TEXT,
			created_at TIMESTAMP NOT NULL DEFAULT NOW()
		);
	`;
}