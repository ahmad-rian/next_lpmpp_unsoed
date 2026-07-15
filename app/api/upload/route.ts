import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import sharp from "sharp";
import { auth } from "@/auth";

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    
    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;
    
    if (!file) {
      return NextResponse.json(
        { error: "No file uploaded" },
        { status: 400 }
      );
    }

    // Validate declared file type (real format re-checked via sharp below)
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "File must be an image" },
        { status: 400 }
      );
    }

    // Server-side size cap (mirrors client guard) to avoid resource abuse
    const MAX_BYTES = 20 * 1024 * 1024;
    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        { error: "File terlalu besar. Maksimal 20MB." },
        { status: 413 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Verify real format from magic bytes; reject SVG/other (SVG can carry scripts)
    const ALLOWED_FORMATS = ["jpeg", "png", "webp", "gif", "avif"];
    const metadata = await sharp(buffer).metadata();
    if (!metadata.format || !ALLOWED_FORMATS.includes(metadata.format)) {
      return NextResponse.json(
        { error: "Format gambar tidak didukung (hanya JPG, PNG, WEBP, GIF, AVIF)." },
        { status: 400 }
      );
    }

    // Generate unique filename — sanitize base to prevent path traversal
    const timestamp = Date.now();
    const originalName =
      file.name
        .replace(/\.[^/.]+$/, "") // Remove extension
        .replace(/[^a-zA-Z0-9_-]/g, "") // Strip separators / traversal chars
        .slice(0, 50) || "image";
    const fileName = `${originalName}-${timestamp}.webp`;

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), "public", "uploads");
    try {
      await mkdir(uploadsDir, { recursive: true });
    } catch (error) {
      // Directory might already exist
    }

    const filePath = join(uploadsDir, fileName);

    // Convert to WebP and save
    await sharp(buffer)
      .webp({ quality: 85 }) // 85% quality for good balance
      .resize(1200, 1200, { // Max width/height, maintains aspect ratio
        fit: "inside",
        withoutEnlargement: true,
      })
      .toFile(filePath);

    // Return the public URL
    const publicUrl = `/uploads/${fileName}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename: fileName,
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}
