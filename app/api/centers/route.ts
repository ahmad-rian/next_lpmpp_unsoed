import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

// GET /api/centers - Get all centers with members
export async function GET() {
  try {
    const centers = await prisma.center.findMany({
      where: { isActive: true },
      include: {
        members: {
          orderBy: [
            { role: 'asc' }, // COORDINATOR first
            { order: 'asc' }
          ]
        }
      },
      orderBy: { order: 'asc' }
    });

    return NextResponse.json(centers);
  } catch (error) {
    console.error("Error fetching centers:", error);
    return NextResponse.json(
      { error: "Failed to fetch centers" },
      { status: 500 }
    );
  }
}

// POST /api/centers - Create new center
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();

    const center = await prisma.center.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        order: data.order || 0,
        isActive: data.isActive !== undefined ? data.isActive : true,
      },
    });

    return NextResponse.json(center);
  } catch (error) {
    console.error("Error creating center:", error);
    return NextResponse.json(
      { error: "Failed to create center" },
      { status: 500 }
    );
  }
}

// PUT /api/centers - Update center
export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    const { id, ...updateData } = data;

    if (!id) {
      return NextResponse.json({ error: "Center ID required" }, { status: 400 });
    }

    const center = await prisma.center.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(center);
  } catch (error) {
    console.error("Error updating center:", error);
    return NextResponse.json(
      { error: "Failed to update center" },
      { status: 500 }
    );
  }
}

// DELETE /api/centers - Delete center
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Center ID required" }, { status: 400 });
    }

    // Delete all members first (cascade)
    await prisma.center.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting center:", error);
    return NextResponse.json(
      { error: "Failed to delete center" },
      { status: 500 }
    );
  }
}
