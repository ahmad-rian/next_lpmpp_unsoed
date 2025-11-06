import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

// GET /api/center-members - Get members by center ID
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const centerId = searchParams.get("centerId");

    if (!centerId) {
      return NextResponse.json(
        { error: "Center ID required" },
        { status: 400 }
      );
    }

    const members = await prisma.centerMember.findMany({
      where: { centerId },
      orderBy: [
        { role: 'asc' }, // COORDINATOR first
        { order: 'asc' }
      ]
    });

    return NextResponse.json(members);
  } catch (error) {
    console.error("Error fetching center members:", error);
    return NextResponse.json(
      { error: "Failed to fetch center members" },
      { status: 500 }
    );
  }
}

// POST /api/center-members - Create new member
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();

    const member = await prisma.centerMember.create({
      data: {
        centerId: data.centerId,
        role: data.role,
        name: data.name,
        title: data.title || "",
        photo: data.photo || null,
        order: data.order || 0,
      },
    });

    return NextResponse.json(member);
  } catch (error) {
    console.error("Error creating center member:", error);
    return NextResponse.json(
      { error: "Failed to create center member" },
      { status: 500 }
    );
  }
}

// PUT /api/center-members - Update member
export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    const { id, ...updateData } = data;

    if (!id) {
      return NextResponse.json(
        { error: "Member ID required" },
        { status: 400 }
      );
    }

    const member = await prisma.centerMember.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(member);
  } catch (error) {
    console.error("Error updating center member:", error);
    return NextResponse.json(
      { error: "Failed to update center member" },
      { status: 500 }
    );
  }
}

// DELETE /api/center-members - Delete member
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Member ID required" },
        { status: 400 }
      );
    }

    await prisma.centerMember.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting center member:", error);
    return NextResponse.json(
      { error: "Failed to delete center member" },
      { status: 500 }
    );
  }
}
