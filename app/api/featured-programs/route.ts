import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// GET - Fetch all featured programs
export async function GET() {
  try {
    const programs = await prisma.featuredProgram.findMany({
      orderBy: {
        order: 'asc'
      }
    });

    return NextResponse.json(programs);
  } catch (error) {
    console.error("Error fetching featured programs:", error);
    return NextResponse.json(
      { error: "Failed to fetch featured programs" },
      { status: 500 }
    );
  }
}

// POST - Create new featured program
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, slug, description, documentUrl, documentName, icon, order } = body;

    if (!title || !slug) {
      return NextResponse.json(
        { error: "Title and slug are required" },
        { status: 400 }
      );
    }

    const program = await prisma.featuredProgram.create({
      data: {
        title,
        slug,
        description: description || "",
        documentUrl: documentUrl || null,
        documentName: documentName || null,
        icon: icon || null,
        order: order || 0,
        isActive: true,
      },
    });

    return NextResponse.json(program);
  } catch (error) {
    console.error("Error creating featured program:", error);
    return NextResponse.json(
      { error: "Failed to create featured program" },
      { status: 500 }
    );
  }
}

// PUT - Update featured program
export async function PUT(request: NextRequest) {
  try {
    const session = await auth();

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id, title, slug, description, documentUrl, documentName, icon, order, isActive } = body;

    if (!id) {
      return NextResponse.json(
        { error: "ID is required" },
        { status: 400 }
      );
    }

    const program = await prisma.featuredProgram.update({
      where: { id },
      data: {
        title,
        slug,
        description,
        documentUrl,
        documentName,
        icon,
        order,
        isActive,
      },
    });

    return NextResponse.json(program);
  } catch (error) {
    console.error("Error updating featured program:", error);
    return NextResponse.json(
      { error: "Failed to update featured program" },
      { status: 500 }
    );
  }
}

// DELETE - Delete featured program
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

    await prisma.featuredProgram.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting featured program:", error);
    return NextResponse.json(
      { error: "Failed to delete featured program" },
      { status: 500 }
    );
  }
}
