import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { requireAdmin } from "@/lib/auth-helpers";

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const guard = await requireAdmin();
    if (guard instanceof NextResponse) return guard;

    const formData = await request.formData();
    const file = formData.get("file") as File;
    
    if (!file) {
      return NextResponse.json(
        { error: "No file uploaded" },
        { status: 400 }
      );
    }

    // Validate file type (allow PDF and Office documents)
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "File must be PDF or Office document (DOC, DOCX, XLS, XLSX)" },
        { status: 400 }
      );
    }

    // Server-side size cap (20MB)
    const MAX_BYTES = 20 * 1024 * 1024;
    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        { error: "File terlalu besar. Maksimal 20MB." },
        { status: 413 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = new Uint8Array(bytes);

    // Verify magic bytes match the declared type family (don't trust client MIME)
    const sig = buffer.slice(0, 4);
    const isPdf = sig[0] === 0x25 && sig[1] === 0x50 && sig[2] === 0x44 && sig[3] === 0x46; // %PDF
    const isZip = sig[0] === 0x50 && sig[1] === 0x4b && sig[2] === 0x03 && sig[3] === 0x04; // PK.. (docx/xlsx)
    const isOle = sig[0] === 0xd0 && sig[1] === 0xcf && sig[2] === 0x11 && sig[3] === 0xe0; // legacy doc/xls

    const extByType: Record<string, string> = {
      "application/pdf": "pdf",
      "application/msword": "doc",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
      "application/vnd.ms-excel": "xls",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
    };
    const extension = extByType[file.type];
    const magicOk =
      (file.type === "application/pdf" && isPdf) ||
      ((file.type.includes("openxmlformats")) && isZip) ||
      ((file.type === "application/msword" || file.type === "application/vnd.ms-excel") && isOle);

    if (!extension || !magicOk) {
      return NextResponse.json(
        { error: "Isi file tidak cocok dengan tipe dokumen yang diizinkan." },
        { status: 400 }
      );
    }

    // Generate unique filename — sanitize base (path traversal) + force safe extension
    const timestamp = Date.now();
    const originalName =
      file.name
        .replace(/\.[^/.]+$/, "") // Remove extension
        .replace(/[^a-zA-Z0-9_-]/g, "") // Strip separators / traversal chars
        .slice(0, 50) || "document";
    const fileName = `${originalName}-${timestamp}.${extension}`;

    // Create documents directory if it doesn't exist
    const docsDir = join(process.cwd(), "public", "documents");
    try {
      await mkdir(docsDir, { recursive: true });
    } catch (error) {
      // Directory might already exist
    }

    const filePath = join(docsDir, fileName);

    // Save file
    await writeFile(filePath, buffer);

    // Return the public URL
    const publicUrl = `/documents/${fileName}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename: fileName,
      size: buffer.length,
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}
