import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/auth-helpers";

// GET /api/gpm-documents - Get documents by groupId
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const groupId = searchParams.get("groupId");

    if (!groupId) {
      return NextResponse.json(
        { error: "Group ID required" },
        { status: 400 }
      );
    }

    const documents = await prisma.qualityAssuranceDocument.findMany({
      where: { groupId },
      orderBy: { order: 'asc' }
    });

    return NextResponse.json(documents);
  } catch (error) {
    console.error("Error fetching GPM documents:", error);
    return NextResponse.json(
      { error: "Failed to fetch GPM documents" },
      { status: 500 }
    );
  }
}

// POST /api/gpm-documents - Create new document
export async function POST(request: NextRequest) {
  try {
    const guard = await requirePermission("gpm.create");
    if (guard instanceof NextResponse) return guard;

    const data = await request.json();

    const document = await prisma.qualityAssuranceDocument.create({
      data: {
        groupId: data.groupId,
        title: data.title,
        fileUrl: data.fileUrl,
        fileName: data.fileName,
        fileSize: data.fileSize || null,
        order: data.order || 0,
      },
    });

    return NextResponse.json(document);
  } catch (error) {
    console.error("Error creating GPM document:", error);
    return NextResponse.json(
      { error: "Failed to create GPM document" },
      { status: 500 }
    );
  }
}

// PUT /api/gpm-documents - Update document
export async function PUT(request: NextRequest) {
  try {
    const guard = await requirePermission("gpm.update");
    if (guard instanceof NextResponse) return guard;

    const data = await request.json();
    const { id } = data;

    if (!id) {
      return NextResponse.json({ error: "Document ID required" }, { status: 400 });
    }

    // Whitelist updatable fields (no mass-assignment from raw body)
    const updateData: Record<string, unknown> = {};
    for (const field of ["groupId", "title", "fileUrl", "fileName", "fileSize", "order"]) {
      if (data[field] !== undefined) updateData[field] = data[field];
    }

    const document = await prisma.qualityAssuranceDocument.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(document);
  } catch (error) {
    console.error("Error updating GPM document:", error);
    return NextResponse.json(
      { error: "Failed to update GPM document" },
      { status: 500 }
    );
  }
}

// DELETE /api/gpm-documents - Delete document
export async function DELETE(request: NextRequest) {
  try {
    const guard = await requirePermission("gpm.delete");
    if (guard instanceof NextResponse) return guard;

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Document ID required" }, { status: 400 });
    }

    await prisma.qualityAssuranceDocument.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting GPM document:", error);
    return NextResponse.json(
      { error: "Failed to delete GPM document" },
      { status: 500 }
    );
  }
}
