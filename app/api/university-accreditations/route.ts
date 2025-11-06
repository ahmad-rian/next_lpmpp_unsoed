import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// GET - Fetch all university accreditations
export async function GET() {
  try {
    const accreditations = await prisma.universityAccreditation.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
    });

    return NextResponse.json(accreditations);
  } catch (error) {
    console.error("Error fetching university accreditations:", error);
    return NextResponse.json(
      { error: "Failed to fetch university accreditations" },
      { status: 500 }
    );
  }
}

// POST - Create new university accreditation
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const data = await request.json();
    
    const accreditation = await prisma.universityAccreditation.create({
      data: {
        title: data.title,
        description: data.description,
        documentUrl: data.documentUrl,
        documentName: data.documentName,
        imageUrl: data.imageUrl,
        order: data.order || 0,
      },
    });

    return NextResponse.json(accreditation);
  } catch (error) {
    console.error("Error creating university accreditation:", error);
    return NextResponse.json(
      { error: "Failed to create university accreditation" },
      { status: 500 }
    );
  }
}

// PUT - Update university accreditation
export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const data = await request.json();
    
    if (!data.id) {
      return NextResponse.json(
        { error: "ID is required" },
        { status: 400 }
      );
    }

    const accreditation = await prisma.universityAccreditation.update({
      where: { id: data.id },
      data: {
        title: data.title,
        description: data.description,
        documentUrl: data.documentUrl,
        documentName: data.documentName,
        imageUrl: data.imageUrl,
        order: data.order,
        isActive: data.isActive,
      },
    });

    return NextResponse.json(accreditation);
  } catch (error) {
    console.error("Error updating university accreditation:", error);
    return NextResponse.json(
      { error: "Failed to update university accreditation" },
      { status: 500 }
    );
  }
}

// DELETE - Delete university accreditation
export async function DELETE(request: NextRequest) {
  try {
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
        { error: "ID is required" },
        { status: 400 }
      );
    }

    await prisma.universityAccreditation.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting university accreditation:", error);
    return NextResponse.json(
      { error: "Failed to delete university accreditation" },
      { status: 500 }
    );
  }
}
