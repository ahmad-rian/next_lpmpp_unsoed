import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// GET - Fetch documents for a specific accreditation
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const accreditationId = searchParams.get("accreditationId");

    if (!accreditationId) {
      return NextResponse.json(
        { error: "Accreditation ID is required" },
        { status: 400 }
      );
    }

    const documents = await prisma.universityAccreditationDocument.findMany({
      where: { accreditationId },
      orderBy: { order: "asc" },
    });

    return NextResponse.json({ documents });
  } catch (error) {
    console.error("Error fetching documents:", error);
    return NextResponse.json(
      { error: "Failed to fetch documents" },
      { status: 500 }
    );
  }
}

// POST - Add new document (ADMIN only)
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { accreditationId, title, documentUrl, documentName, order } = body;

    if (!accreditationId || !title || !documentUrl) {
      return NextResponse.json(
        { error: "Accreditation ID, title, and document URL are required" },
        { status: 400 }
      );
    }

    const document = await prisma.universityAccreditationDocument.create({
      data: {
        accreditationId,
        title,
        documentUrl,
        documentName,
        order: order || 0,
      },
    });

    return NextResponse.json({ document });
  } catch (error) {
    console.error("Error creating document:", error);
    return NextResponse.json(
      { error: "Failed to create document" },
      { status: 500 }
    );
  }
}

// PUT - Update document (ADMIN only)
export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id, title, documentUrl, documentName, order } = body;

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const document = await prisma.universityAccreditationDocument.update({
      where: { id },
      data: {
        title,
        documentUrl,
        documentName,
        order,
      },
    });

    return NextResponse.json({ document });
  } catch (error) {
    console.error("Error updating document:", error);
    return NextResponse.json(
      { error: "Failed to update document" },
      { status: 500 }
    );
  }
}

// DELETE - Delete document (ADMIN only)
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    await prisma.universityAccreditationDocument.delete({
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
