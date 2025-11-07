import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// GET - Fetch expertise by type or all
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");

    const where = type ? { type: type as any } : {};

    const expertise = await prisma.expertise.findMany({
      where,
      orderBy: {
        order: "asc",
      },
    });

    return NextResponse.json(expertise);
  } catch (error) {
    console.error("Error fetching expertise:", error);
    return NextResponse.json(
      { error: "Failed to fetch expertise" },
      { status: 500 }
    );
  }
}

// POST - Create new expertise
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { type, name, order } = body;

    if (!type || !name) {
      return NextResponse.json(
        { error: "Type and name are required" },
        { status: 400 }
      );
    }

    const expertise = await prisma.expertise.create({
      data: {
        type,
        name,
        order: order || 0,
      },
    });

    return NextResponse.json(expertise);
  } catch (error) {
    console.error("Error creating expertise:", error);
    return NextResponse.json(
      { error: "Failed to create expertise" },
      { status: 500 }
    );
  }
}

// PUT - Update expertise
export async function PUT(request: NextRequest) {
  try {
    const session = await auth();

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id, type, name, order, isActive } = body;

    if (!id) {
      return NextResponse.json(
        { error: "ID is required" },
        { status: 400 }
      );
    }

    const expertise = await prisma.expertise.update({
      where: { id },
      data: {
        type,
        name,
        order,
        isActive,
      },
    });

    return NextResponse.json(expertise);
  } catch (error) {
    console.error("Error updating expertise:", error);
    return NextResponse.json(
      { error: "Failed to update expertise" },
      { status: 500 }
    );
  }
}

// DELETE - Delete expertise
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "ID is required" },
        { status: 400 }
      );
    }

    await prisma.expertise.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting expertise:", error);
    return NextResponse.json(
      { error: "Failed to delete expertise" },
      { status: 500 }
    );
  }
}
