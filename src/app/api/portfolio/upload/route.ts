import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { portfolioItems } from "@/lib/schema";
import { uploadFileToCloudinary } from "@/lib/cloudinary";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    const fileType = file.type;
    const isImage = fileType.startsWith("image/");
    const isVideo = fileType.startsWith("video/");

    if (!isImage && !isVideo) {
      return NextResponse.json(
        { error: "Invalid file type. Only images and videos are allowed." },
        { status: 400 }
      );
    }

    const uploaded = await uploadFileToCloudinary(file, { folder: "portfolio" });

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