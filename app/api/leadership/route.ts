import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// GET - Fetch all leadership
export async function GET() {
  try {
    const leadership = await prisma.leadership.findMany({
      orderBy: { position: "asc" },
    });

    return NextResponse.json(leadership);
  } catch (error) {
    console.error("Error fetching leadership:", error);
    return NextResponse.json(
      { error: "Failed to fetch leadership data" },
      { status: 500 }
    );
  }
}

// PUT - Update leadership
export async function PUT(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    
    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const data = await request.json();
    
    // Validate required fields
    if (!data.position || !data.name) {
      return NextResponse.json(
        { error: "Position and name are required" },
        { status: 400 }
      );
    }

    // Validate position
    if (!["HEAD", "SECRETARY"].includes(data.position)) {
      return NextResponse.json(
        { error: "Invalid position. Must be HEAD or SECRETARY" },
        { status: 400 }
      );
    }

    // Update leadership
    const leadership = await prisma.leadership.upsert({
      where: { position: data.position },
      update: {
        name: data.name,
        title: data.title,
        photo: data.photo,
      },
      create: {
        position: data.position,
        name: data.name,
        title: data.title,
        photo: data.photo,
      },
    });

    return NextResponse.json({
      message: "Leadership updated successfully",
      data: leadership,
    });
  } catch (error) {
    console.error("Error updating leadership:", error);
    return NextResponse.json(
      { error: "Failed to update leadership" },
      { status: 500 }
    );
  }
}
