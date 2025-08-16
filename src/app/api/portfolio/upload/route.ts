import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { writeFile, mkdir } from "fs/promises";

const UPLOADS_DIR = path.join(process.cwd(), "public/uploads");
const PORTFOLIO_DATA_FILE = path.join(process.cwd(), "src/data/portfolio.json");

interface PortfolioItem {
  id: string;
  type: "image" | "video";
  src: string;
  thumb?: string;
  createdAt: string;
}

async function ensureUploadsDir() {
  try {
    await fs.access(UPLOADS_DIR);
  } catch {
    await mkdir(UPLOADS_DIR, { recursive: true });
  }
}

async function ensurePortfolioFile() {
  try {
    await fs.access(PORTFOLIO_DATA_FILE);
  } catch {
    await fs.writeFile(PORTFOLIO_DATA_FILE, JSON.stringify({ items: [] }));
  }
}

export async function POST(request: NextRequest) {
  try {
    await ensureUploadsDir();
    await ensurePortfolioFile();

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    // Validate file type
    const fileType = file.type;
    const isImage = fileType.startsWith("image/");
    const isVideo = fileType.startsWith("video/");

    if (!isImage && !isVideo) {
      return NextResponse.json(
        { error: "Invalid file type. Only images and videos are allowed." },
        { status: 400 }
      );
    }

    // Generate unique filename
    const timestamp = Date.now();
    const fileExtension = file.name.split(".").pop();
    const filename = `${timestamp}-${Math.random().toString(36).substring(2)}.${fileExtension}`;
    const filePath = path.join(UPLOADS_DIR, filename);

    // Save file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // Create portfolio item
    const portfolioItem: PortfolioItem = {
      id: `item-${timestamp}`,
      type: isImage ? "image" : "video",
      src: `/uploads/${filename}`,
      createdAt: new Date().toISOString(),
    };

    // Add to portfolio data
    const portfolioData = await fs.readFile(PORTFOLIO_DATA_FILE, "utf-8");
    const portfolio = JSON.parse(portfolioData);
    portfolio.items.push(portfolioItem);
    await fs.writeFile(PORTFOLIO_DATA_FILE, JSON.stringify(portfolio, null, 2));

    return NextResponse.json({
      success: true,
      item: portfolioItem,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
} 