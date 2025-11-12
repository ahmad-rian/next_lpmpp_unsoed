import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const groupId = searchParams.get("groupId");

    if (!groupId) {
      return NextResponse.json({ error: "Group ID is required" }, { status: 400 });
    }

    const links = await prisma.gPMLink.findMany({
      where: {
        groupId: groupId,
      },
      orderBy: {
        order: "asc",
      },
    });

    return NextResponse.json(links);
  } catch (error) {
    console.error("Error fetching GPM links:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, url, description, groupId, order } = body;

    if (!title || !url || !groupId) {
      return NextResponse.json(
        { error: "Title, URL, and Group ID are required" },
        { status: 400 }
      );
    }

    const link = await prisma.gPMLink.create({
      data: {
        title,
        url,
        description,
        groupId,
        order: order || 1,
      },
    });

    return NextResponse.json(link, { status: 201 });
  } catch (error) {
    console.error("Error creating GPM link:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, title, url, description, order } = body;

    if (!id) {
      return NextResponse.json({ error: "Link ID is required" }, { status: 400 });
    }

    const link = await prisma.gPMLink.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(url && { url }),
        ...(description !== undefined && { description }),
        ...(order !== undefined && { order }),
      },
    });

    return NextResponse.json(link);
  } catch (error) {
    console.error("Error updating GPM link:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: "Link ID is required" }, { status: 400 });
    }

    await prisma.gPMLink.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Link deleted successfully" });
  } catch (error) {
    console.error("Error deleting GPM link:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
