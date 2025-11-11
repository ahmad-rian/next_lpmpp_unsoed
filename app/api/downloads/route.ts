import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Fetch all downloads or single download by id
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get("id");

    // Detail & increment count atomically
    if (id) {
      const download = await prisma.download.update({
        where: { id },
        data: {
          downloadCount: {
            increment: 1,
          },
        },
        // Select only fields needed by client
        select: {
          id: true,
          name: true,
          description: true,
          fileUrl: true,
          fileType: true,
          fileSize: true,
          downloadCount: true,
          createdAt: true,
        },
      });

      if (!download) {
        return NextResponse.json(
          { error: "Download not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(download);
    }

    // Optional paginated list for efficiency
    const paginated = searchParams.get("paginated") === "true";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const pageSize = parseInt(searchParams.get("pageSize") || "12", 10);
    const q = searchParams.get("q")?.trim() || "";

    const where = q
      ? {
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { description: { contains: q, mode: "insensitive" } },
          ],
        }
      : undefined;

    if (paginated) {
      const [items, total] = await Promise.all([
        prisma.download.findMany({
          where,
          orderBy: { createdAt: "desc" },
          skip: (page - 1) * pageSize,
          take: pageSize,
          select: {
            id: true,
            name: true,
            description: true,
            fileUrl: true,
            fileType: true,
            fileSize: true,
            downloadCount: true,
            createdAt: true,
          },
        }),
        prisma.download.count({ where }),
      ]);

      return NextResponse.json({ items, total, page, pageSize });
    }

    // Legacy behavior: return full array (compatibility)
    const downloads = await prisma.download.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(downloads);
  } catch (error) {
    console.error("Error fetching downloads:", error);
    return NextResponse.json(
      { error: "Failed to fetch downloads" },
      { status: 500 }
    );
  }
}

// POST - Create new download
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, fileUrl, fileType, fileSize } = body;

    if (!name || !fileUrl || !fileType || !fileSize) {
      return NextResponse.json(
        { error: "Name, file URL, file type, and file size are required" },
        { status: 400 }
      );
    }

    const download = await prisma.download.create({
      data: {
        name,
        description,
        fileUrl,
        fileType,
        fileSize,
      },
    });

    return NextResponse.json(download, { status: 201 });
  } catch (error) {
    console.error("Error creating download:", error);
    return NextResponse.json(
      { error: "Failed to create download" },
      { status: 500 }
    );
  }
}

// PUT - Update download
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, description, fileUrl, fileType, fileSize } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Download ID is required" },
        { status: 400 }
      );
    }

    const download = await prisma.download.update({
      where: { id },
      data: {
        name,
        description,
        fileUrl,
        fileType,
        fileSize,
      },
    });

    return NextResponse.json(download);
  } catch (error) {
    console.error("Error updating download:", error);
    return NextResponse.json(
      { error: "Failed to update download" },
      { status: 500 }
    );
  }
}

// DELETE - Delete download
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Download ID is required" },
        { status: 400 }
      );
    }

    await prisma.download.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Download deleted successfully" });
  } catch (error) {
    console.error("Error deleting download:", error);
    return NextResponse.json(
      { error: "Failed to delete download" },
      { status: 500 }
    );
  }
}
