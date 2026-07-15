import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/auth-helpers";

// GET /api/documents - Get documents by type
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") as "SPMI" | "AUDIT" | "REGULATION" | "PPID" | null;

    const where = type ? { type, isActive: true } : { isActive: true };

    const documents = await prisma.document.findMany({
      where,
      orderBy: { order: 'asc' }
    });

    return NextResponse.json(documents);
  } catch (error) {
    console.error("Error fetching documents:", error);
    return NextResponse.json(
      { error: "Failed to fetch documents" },
      { status: 500 }
    );
  }
}

// POST /api/documents - Create new document
export async function POST(request: NextRequest) {
  try {
    const guard = await requirePermission("spmi-documents.create");
    if (guard instanceof NextResponse) return guard;

    const data = await request.json();

    const document = await prisma.document.create({
      data: {
        type: data.type,
        title: data.title,
        description: data.description || null,
        fileUrl: data.fileUrl,
        fileName: data.fileName,
        fileSize: data.fileSize || null,
        order: data.order || 0,
        isActive: data.isActive !== undefined ? data.isActive : true,
      },
    });

    return NextResponse.json(document);
  } catch (error) {
    console.error("Error creating document:", error);
    return NextResponse.json(
      { error: "Failed to create document" },
      { status: 500 }
    );
  }
}

// PUT /api/documents - Update document
export async function PUT(request: NextRequest) {
  try {
    const guard = await requirePermission("spmi-documents.update");
    if (guard instanceof NextResponse) return guard;

    const data = await request.json();
    const { id } = data;

    if (!id) {
      return NextResponse.json({ error: "Document ID required" }, { status: 400 });
    }

    // Whitelist updatable fields (no mass-assignment from raw body)
    const updateData: Record<string, unknown> = {};
    for (const field of ["type", "title", "description", "fileUrl", "fileName", "fileSize", "order", "isActive"]) {
      if (data[field] !== undefined) updateData[field] = data[field];
    }

    const document = await prisma.document.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(document);
  } catch (error) {
    console.error("Error updating document:", error);
    return NextResponse.json(
      { error: "Failed to update document" },
      { status: 500 }
    );
  }
}

// DELETE /api/documents - Delete document
export async function DELETE(request: NextRequest) {
  try {
    const guard = await requirePermission("spmi-documents.delete");
    if (guard instanceof NextResponse) return guard;

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Document ID required" }, { status: 400 });
    }

    await prisma.document.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting document:", error);
    return NextResponse.json(
      { error: "Failed to delete document" },
      { status: 500 }
    );
  }
}
