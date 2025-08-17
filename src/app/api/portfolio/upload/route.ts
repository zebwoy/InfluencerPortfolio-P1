import { NextRequest, NextResponse } from "next/server";
import { db, ensureSchema } from "@/lib/db";
import { portfolioItems } from "@/lib/schema";
import { uploadFileToCloudinary } from "@/lib/cloudinary";

export async function POST(request: NextRequest) {
  try {
    await ensureSchema();

    const contentType = request.headers.get("content-type") || "";

    // Path 1: JSON body with direct Cloudinary URL (preferred for large files)
    if (contentType.includes("application/json")) {
      const { url, type } = await request.json();
      if (!url) {
        return NextResponse.json({ error: "Missing url" }, { status: 400 });
      }
      if (!type || !["image", "video"].includes(type)) {
        return NextResponse.json({ error: "Missing or invalid type: expected 'image' | 'video'" }, { status: 400 });
      }
      const id = `item-${Date.now()}`;
      const [inserted] = await db.insert(portfolioItems)
        .values({ id, type, src: url })
        .returning();
      return NextResponse.json({ success: true, item: inserted });
    }

    // Path 2: multipart file upload (small files only)
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    const fileType = file.type || "";
    const isImage = fileType.startsWith("image/");
    const isVideo = fileType.startsWith("video/");

    if (!isImage && !isVideo) {
      return NextResponse.json(
        { error: "Invalid file type. Only images and videos are allowed." },
        { status: 400 }
      );
    }

    let uploaded;
    try {
      uploaded = await uploadFileToCloudinary(file, { folder: "portfolio" });
    } catch (e) {
      console.error("Cloudinary upload failed:", e);
      return NextResponse.json({ error: "Upload to Cloudinary failed" }, { status: 502 });
    }

    const id = `item-${Date.now()}`;
    const [inserted] = await db.insert(portfolioItems)
      .values({ id, type: isImage ? "image" : "video", src: uploaded.secure_url })
      .returning();

    return NextResponse.json({ success: true, item: inserted });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
} 