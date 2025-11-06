import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// GET - Fetch all staff grouped by position
export async function GET() {
  try {
    const staff = await prisma.staff.findMany({
      orderBy: [
        { position: "asc" },
        { order: "asc" },
      ],
    });

    return NextResponse.json(staff);
  } catch (error) {
    console.error("Error fetching staff:", error);
    return NextResponse.json(
      { error: "Failed to fetch staff data" },
      { status: 500 }
    );
  }
}

// POST - Create new staff
export async function POST(request: NextRequest) {
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

    // Create staff
    const staff = await prisma.staff.create({
      data: {
        position: data.position,
        name: data.name,
        title: data.title,
        photo: data.photo,
        order: data.order || 0,
      },
    });

    return NextResponse.json({
      message: "Staff created successfully",
      data: staff,
    });
  } catch (error) {
    console.error("Error creating staff:", error);
    return NextResponse.json(
      { error: "Failed to create staff" },
      { status: 500 }
    );
  }
}

// PUT - Update staff
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
    if (!data.id) {
      return NextResponse.json(
        { error: "Staff ID is required" },
        { status: 400 }
      );
    }

    // Update staff
    const staff = await prisma.staff.update({
      where: { id: data.id },
      data: {
        name: data.name,
        title: data.title,
        photo: data.photo,
        order: data.order,
      },
    });

    return NextResponse.json({
      message: "Staff updated successfully",
      data: staff,
    });
  } catch (error) {
    console.error("Error updating staff:", error);
    return NextResponse.json(
      { error: "Failed to update staff" },
      { status: 500 }
    );
  }
}

// DELETE - Delete staff
export async function DELETE(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    
    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Staff ID is required" },
        { status: 400 }
      );
    }

    await prisma.staff.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "Staff deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting staff:", error);
    return NextResponse.json(
      { error: "Failed to delete staff" },
      { status: 500 }
    );
  }
}
