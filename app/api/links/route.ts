import { NextRequest, NextResponse } from "next/server";
import { requirePermission } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";

// GET - Fetch all links
export async function GET() {
  try {
    const links = await prisma.link.findMany({
      orderBy: {
        order: "asc",
      },
    });

    return NextResponse.json(links);
  } catch (error) {
    console.error("Error fetching links:", error);
    return NextResponse.json(
      { error: "Failed to fetch links" },
      { status: 500 }
    );
  }
}

// POST - Create new link
export async function POST(request: NextRequest) {
  try {
    const guard = await requirePermission("links.create");
    if (guard instanceof NextResponse) return guard;

    const body = await request.json();
    const { name, url, order } = body;

    if (!name || !url) {
      return NextResponse.json(
        { error: "Name and URL are required" },
        { status: 400 }
      );
    }

    const link = await prisma.link.create({
      data: {
        name,
        url,
        order: order || 0,
      },
    });

    return NextResponse.json(link);
  } catch (error) {
    console.error("Error creating link:", error);
    return NextResponse.json(
      { error: "Failed to create link" },
      { status: 500 }
    );
  }
}

// PUT - Update link
export async function PUT(request: NextRequest) {
  try {
    const guard = await requirePermission("links.update");
    if (guard instanceof NextResponse) return guard;

    const body = await request.json();
    const { id, name, url, order, isActive } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Link ID is required" },
        { status: 400 }
      );
    }

    const link = await prisma.link.update({
      where: { id },
      data: {
        name,
        url,
        order,
        isActive,
      },
    });

    return NextResponse.json(link);
  } catch (error) {
    console.error("Error updating link:", error);
    return NextResponse.json(
      { error: "Failed to update link" },
      { status: 500 }
    );
  }
}

// DELETE - Delete link
export async function DELETE(request: NextRequest) {
  try {
    const guard = await requirePermission("links.delete");
    if (guard instanceof NextResponse) return guard;

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Link ID is required" },
        { status: 400 }
      );
    }

    await prisma.link.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Link deleted successfully" });
  } catch (error) {
    console.error("Error deleting link:", error);
    return NextResponse.json(
      { error: "Failed to delete link" },
      { status: 500 }
    );
  }
}
