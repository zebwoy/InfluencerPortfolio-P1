import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { unlink } from "fs/promises";

const PORTFOLIO_DATA_FILE = path.join(process.cwd(), "src/data/portfolio.json");

interface PortfolioItem {
  id: string;
  type: "image" | "video";
  src: string;
  thumb?: string;
  createdAt: string;
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Read current portfolio data
    const portfolioData = await fs.readFile(PORTFOLIO_DATA_FILE, "utf-8");
    const portfolio = JSON.parse(portfolioData);

    // Find the item to delete
    const itemIndex = portfolio.items.findIndex((item: PortfolioItem) => item.id === id);
    if (itemIndex === -1) {
      return NextResponse.json(
        { error: "Item not found" },
        { status: 404 }
      );
    }

    const item = portfolio.items[itemIndex];

    // Delete the file from uploads directory
    if (item.src) {
      const filePath = path.join(process.cwd(), "public", item.src);
      try {
        await unlink(filePath);
      } catch (error) {
        console.warn("Could not delete file:", error);
      }
    }

    // Remove item from portfolio data
    portfolio.items.splice(itemIndex, 1);
    await fs.writeFile(PORTFOLIO_DATA_FILE, JSON.stringify(portfolio, null, 2));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete item" },
      { status: 500 }
    );
  }
} 