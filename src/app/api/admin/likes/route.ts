import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const LIKES_CSV_FILE = path.join(process.cwd(), "src/data/likes.csv");

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

export async function GET() {
  try {
    await ensureLikesFile();

    // Read CSV file
    const likesData = await fs.readFile(LIKES_CSV_FILE, "utf-8");
    const lines = likesData.split("\n").filter(line => line.trim());
    
    if (lines.length <= 1) {
      // Only headers, no data
      return NextResponse.json({ likes: [] });
    }

    const headers = lines[0].split(",");
    const records: LikeRecord[] = lines.slice(1).map(line => {
      const values = line.split(",");
      const record: CSVRecord = {};
      headers.forEach((header, index) => {
        record[header] = values[index];
      });
      return {
        timestamp: record.timestamp || "",
        itemId: record.itemId || "",
        action: (record.action as "like" | "unlike") || "like",
        ipAddress: record.ipAddress || "",
        userAgent: record.userAgent || "",
        location: record.location,
        country: record.country,
        city: record.city,
        timezone: record.timezone,
        referrer: record.referrer,
      };
    });

    return NextResponse.json({ likes: records });
  } catch (error) {
    console.error("Error reading likes data:", error);
    return NextResponse.json(
      { error: "Failed to load likes data" },
      { status: 500 }
    );
  }
} 