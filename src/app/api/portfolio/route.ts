import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const PORTFOLIO_DATA_FILE = path.join(process.cwd(), "src/data/portfolio.json");

async function ensurePortfolioFile() {
  try {
    await fs.access(PORTFOLIO_DATA_FILE);
  } catch {
    // Create file if it doesn't exist
    await fs.writeFile(PORTFOLIO_DATA_FILE, JSON.stringify({ items: [] }));
  }
}

export async function GET() {
  try {
    await ensurePortfolioFile();
    const data = await fs.readFile(PORTFOLIO_DATA_FILE, "utf-8");
    const portfolio = JSON.parse(data);
    
    return NextResponse.json(portfolio);
  } catch (error) {
    console.error("Error reading portfolio data:", error);
    return NextResponse.json(
      { error: "Failed to load portfolio data" },
      { status: 500 }
    );
  }
} 