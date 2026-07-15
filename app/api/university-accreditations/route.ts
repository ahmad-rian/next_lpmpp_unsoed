import { NextRequest, NextResponse } from "next/server";
import { requirePermission } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";

// GET - Fetch all university accreditations with documents
export async function GET() {
  try {
    const accreditations = await prisma.universityAccreditation.findMany({
      include: {
        documents: {
          orderBy: {
            order: 'asc'
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(accreditations);
  } catch (error) {
    console.error("Error fetching university accreditations:", error);
    return NextResponse.json(
      { error: "Failed to fetch university accreditations" },
      { status: 500 }
    );
  }
}

// POST - Create new university accreditation
export async function POST(request: NextRequest) {
  try {
    const guard = await requirePermission("accreditation.create");
    if (guard instanceof NextResponse) return guard;

    const body = await request.json();
    const { title, description, imageUrl, isActive } = body;

    if (!title) {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      );
    }

    const accreditation = await prisma.universityAccreditation.create({
      data: {
        title,
        description: description || "",
        imageUrl: imageUrl || "",
        isActive: isActive !== undefined ? isActive : true,
      },
      include: {
        documents: true
      }
    });

    return NextResponse.json(accreditation);
  } catch (error) {
    console.error("Error creating university accreditation:", error);
    return NextResponse.json(
      { error: "Failed to create university accreditation" },
      { status: 500 }
    );
  }
}

// PUT - Update university accreditation
export async function PUT(request: NextRequest) {
  try {
    const guard = await requirePermission("accreditation.update");
    if (guard instanceof NextResponse) return guard;

    const body = await request.json();
    const { id, title, description, imageUrl, isActive } = body;

    if (!id) {
      return NextResponse.json(
        { error: "ID is required" },
        { status: 400 }
      );
    }

    const accreditation = await prisma.universityAccreditation.update({
      where: { id },
      data: {
        title,
        description,
        imageUrl,
        isActive,
      },
      include: {
        documents: {
          orderBy: {
            order: 'asc'
          }
        }
      }
    });

    return NextResponse.json(accreditation);
  } catch (error) {
    console.error("Error updating university accreditation:", error);
    return NextResponse.json(
      { error: "Failed to update university accreditation" },
      { status: 500 }
    );
  }
}

// DELETE - Delete university accreditation (documents will be cascade deleted)
export async function DELETE(request: NextRequest) {
  try {
    const guard = await requirePermission("accreditation.delete");
    if (guard instanceof NextResponse) return guard;

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "ID is required" },
        { status: 400 }
      );
    }

    // Delete accreditation (documents will be cascade deleted)
    await prisma.universityAccreditation.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting university accreditation:", error);
    return NextResponse.json(
      { error: "Failed to delete university accreditation" },
      { status: 500 }
    );
  }
}
