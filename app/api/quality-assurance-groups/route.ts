import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

// GET /api/quality-assurance-groups - Get all groups
export async function GET() {
  try {
    const groups = await prisma.qualityAssuranceGroup.findMany({
      where: { isActive: true },
      include: {
        faculty: true, // Include faculty data
      },
      orderBy: { order: 'asc' }
    });

    return NextResponse.json(groups);
  } catch (error) {
    console.error("Error fetching quality assurance groups:", error);
    return NextResponse.json(
      { error: "Failed to fetch quality assurance groups" },
      { status: 500 }
    );
  }
}

// POST /api/quality-assurance-groups - Create new group
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();

    const group = await prisma.qualityAssuranceGroup.create({
      data: {
        facultyId: data.facultyId,
        ketuaGpm: data.ketuaGpm || null,
        description: data.description || null,
        contactInfo: data.contactInfo || null,
        order: data.order || 0,
        isActive: data.isActive !== undefined ? data.isActive : true,
      },
      include: {
        faculty: true,
      },
    });

    return NextResponse.json(group);
  } catch (error) {
    console.error("Error creating quality assurance group:", error);
    return NextResponse.json(
      { error: "Failed to create quality assurance group" },
      { status: 500 }
    );
  }
}

// PUT /api/quality-assurance-groups - Update group
export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    const { id, ...updateData } = data;

    if (!id) {
      return NextResponse.json({ error: "Group ID required" }, { status: 400 });
    }

    const group = await prisma.qualityAssuranceGroup.update({
      where: { id },
      data: updateData,
      include: {
        faculty: true,
      },
    });

    return NextResponse.json(group);
  } catch (error) {
    console.error("Error updating quality assurance group:", error);
    return NextResponse.json(
      { error: "Failed to update quality assurance group" },
      { status: 500 }
    );
  }
}

// DELETE /api/quality-assurance-groups - Delete group
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Group ID required" }, { status: 400 });
    }

    await prisma.qualityAssuranceGroup.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting quality assurance group:", error);
    return NextResponse.json(
      { error: "Failed to delete quality assurance group" },
      { status: 500 }
    );
  }
}
