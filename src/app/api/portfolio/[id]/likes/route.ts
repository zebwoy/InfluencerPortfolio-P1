import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const LIKES_CSV_FILE = path.join(process.cwd(), "src/data/likes.csv");
const PORTFOLIO_DATA_FILE = path.join(process.cwd(), "src/data/portfolio.json");

interface PortfolioItem {
  id: string;
  type: "image" | "video";
  src: string;
  thumb?: string;
  createdAt: string;
  likeCount?: number;
}

interface LikeRecord {
  timestamp: string;
  itemId: string;
  action: "like" | "unlike";
  ipAddress: string;
  userAgent: string;
  location?: string;
  country?: string;
  city?: string;
  timezone?: string;
  referrer?: string;
}

interface CSVRecord {
  [key: string]: string;
}

async function ensureLikesFile() {
  try {
    await fs.access(LIKES_CSV_FILE);
  } catch {
    // Create CSV file with headers if it doesn't exist
    const headers = "timestamp,itemId,action,ipAddress,userAgent,location,country,city,timezone,referrer\n";
    await fs.writeFile(LIKES_CSV_FILE, headers);
  }
}

async function ensurePortfolioFile() {
  try {
    await fs.access(PORTFOLIO_DATA_FILE);
  } catch {
    await fs.writeFile(PORTFOLIO_DATA_FILE, JSON.stringify({ items: [] }));
  }
}

async function getClientLocation(ip: string): Promise<{ country?: string; city?: string; timezone?: string }> {
  try {
    // Use a free IP geolocation service
    const response = await fetch(`http://ip-api.com/json/${ip}`);
    if (response.ok) {
      const data = await response.json();
      return {
        country: data.country,
        city: data.city,
        timezone: data.timezone,
      };
    }
  } catch (error) {
    console.warn("Failed to get location data:", error);
  }
  return {};
}

function getClientIP(request: NextRequest): string {
  // Try to get real IP from various headers
  const forwarded = request.headers.get("x-forwarded-for");
  const realIP = request.headers.get("x-real-ip");
  const cfConnectingIP = request.headers.get("cf-connecting-ip");
  
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  if (realIP) {
    return realIP;
  }
  if (cfConnectingIP) {
    return cfConnectingIP;
  }
  
  return "unknown";
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await ensurePortfolioFile();
    await ensureLikesFile();

    // Read portfolio data to get like count
    const portfolioData = await fs.readFile(PORTFOLIO_DATA_FILE, "utf-8");
    const portfolio = JSON.parse(portfolioData);
    const item = portfolio.items.find((item: PortfolioItem) => item.id === id);
    
    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    // Count likes from CSV
    const likesData = await fs.readFile(LIKES_CSV_FILE, "utf-8");
    const lines = likesData.split("\n").filter(line => line.trim());
    const headers = lines[0].split(",");
    const records: CSVRecord[] = lines.slice(1).map(line => {
      const values = line.split(",");
      const record: CSVRecord = {};
      headers.forEach((header, index) => {
        record[header] = values[index];
      });
      return record;
    });

    const itemLikes = records.filter((record: CSVRecord) => 
      record.itemId === id && record.action === "like"
    );
    const itemUnlikes = records.filter((record: CSVRecord) => 
      record.itemId === id && record.action === "unlike"
    );

    const likeCount = Math.max(0, itemLikes.length - itemUnlikes.length);

    // Check if current user has liked (simple IP-based check)
    const clientIP = getClientIP(request);
    const userLiked = itemLikes.some((record: CSVRecord) => record.ipAddress === clientIP);
    const userUnliked = itemUnlikes.some((record: CSVRecord) => record.ipAddress === clientIP);
    const isLiked = userLiked && !userUnliked;

    return NextResponse.json({
      likeCount,
      isLiked,
    });
  } catch (error) {
    console.error("Error getting likes:", error);
    return NextResponse.json(
      { error: "Failed to get like data" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { action } = await request.json();
    
    if (!action || !["like", "unlike"].includes(action)) {
      return NextResponse.json(
        { error: "Invalid action" },
        { status: 400 }
      );
    }

    await ensureLikesFile();
    await ensurePortfolioFile();

    // Get client information
    const clientIP = getClientIP(request);
    const userAgent = request.headers.get("user-agent") || "unknown";
    const referrer = request.headers.get("referer") || "";
    
    // Get location data
    const locationData = await getClientLocation(clientIP);
    
    // Create like record
    const likeRecord: LikeRecord = {
      timestamp: new Date().toISOString(),
      itemId: id,
      action,
      ipAddress: clientIP,
      userAgent,
      location: `${locationData.city || "unknown"}, ${locationData.country || "unknown"}`,
      country: locationData.country,
      city: locationData.city,
      timezone: locationData.timezone,
      referrer,
    };

    // Append to CSV file
    const csvLine = [
      likeRecord.timestamp,
      likeRecord.itemId,
      likeRecord.action,
      likeRecord.ipAddress,
      `"${likeRecord.userAgent.replace(/"/g, '""')}"`, // Escape quotes in user agent
      likeRecord.location,
      likeRecord.country,
      likeRecord.city,
      likeRecord.timezone,
      likeRecord.referrer,
    ].join(",");

    await fs.appendFile(LIKES_CSV_FILE, csvLine + "\n");

    // Update portfolio item like count
    const portfolioData = await fs.readFile(PORTFOLIO_DATA_FILE, "utf-8");
    const portfolio = JSON.parse(portfolioData);
    const itemIndex = portfolio.items.findIndex((item: PortfolioItem) => item.id === id);
    
    if (itemIndex !== -1) {
      // Calculate new like count
      const likesData = await fs.readFile(LIKES_CSV_FILE, "utf-8");
      const lines = likesData.split("\n").filter(line => line.trim());
      const headers = lines[0].split(",");
      const records: CSVRecord[] = lines.slice(1).map(line => {
        const values = line.split(",");
        const record: CSVRecord = {};
        headers.forEach((header, index) => {
          record[header] = values[index];
        });
        return record;
      });

      const itemLikes = records.filter((record: CSVRecord) => 
        record.itemId === id && record.action === "like"
      );
      const itemUnlikes = records.filter((record: CSVRecord) => 
        record.itemId === id && record.action === "unlike"
      );

      const newLikeCount = Math.max(0, itemLikes.length - itemUnlikes.length);
      portfolio.items[itemIndex].likeCount = newLikeCount;
      
      await fs.writeFile(PORTFOLIO_DATA_FILE, JSON.stringify(portfolio, null, 2));
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating like:", error);
    return NextResponse.json(
      { error: "Failed to update like" },
      { status: 500 }
    );
  }
} 