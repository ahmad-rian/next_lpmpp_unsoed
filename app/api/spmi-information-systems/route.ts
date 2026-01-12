import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

// GET /api/spmi-information-systems - Get all information systems
export async function GET() {
  try {
    const systems = await prisma.spmiInformationSystem.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' }
    });

    return NextResponse.json(systems);
  } catch (error) {
    console.error("Error fetching SPMI information systems:", error);
    return NextResponse.json(
      { error: "Failed to fetch SPMI information systems" },
      { status: 500 }
    );
  }
}

// POST /api/spmi-information-systems - Create new system
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();

    const system = await prisma.spmiInformationSystem.create({
      data: {
        name: data.name,
        shortName: data.shortName || null,
        description: data.description || null,
        logoUrl: data.logoUrl || null,
        websiteUrl: data.websiteUrl || null,
        category: data.category || null,
        order: data.order || 0,
        isActive: data.isActive !== undefined ? data.isActive : true,
      },
    });

    return NextResponse.json(system);
  } catch (error) {
    console.error("Error creating SPMI information system:", error);
    return NextResponse.json(
      { error: "Failed to create SPMI information system" },
      { status: 500 }
    );
  }
}

// PUT /api/spmi-information-systems - Update system
export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    const { id, ...updateData } = data;

    if (!id) {
      return NextResponse.json({ error: "System ID required" }, { status: 400 });
    }

    const system = await prisma.spmiInformationSystem.update({
      where: { id },
      data: {
        name: updateData.name,
        shortName: updateData.shortName || null,
        description: updateData.description || null,
        logoUrl: updateData.logoUrl || null,
        websiteUrl: updateData.websiteUrl || null,
        category: updateData.category || null,
        order: updateData.order,
        isActive: updateData.isActive,
      },
    });

    return NextResponse.json(system);
  } catch (error) {
    console.error("Error updating SPMI information system:", error);
    return NextResponse.json(
      { error: "Failed to update SPMI information system" },
      { status: 500 }
    );
  }
}

// DELETE /api/spmi-information-systems - Delete system
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "System ID required" }, { status: 400 });
    }

    await prisma.spmiInformationSystem.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting SPMI information system:", error);
    return NextResponse.json(
      { error: "Failed to delete SPMI information system" },
      { status: 500 }
    );
  }
}
