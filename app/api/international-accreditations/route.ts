import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// GET - Fetch all international accreditations
export async function GET() {
  try {
    const accreditations = await prisma.internationalAccreditation.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
    });

    return NextResponse.json(accreditations);
  } catch (error) {
    console.error("Error fetching international accreditations:", error);
    return NextResponse.json(
      { error: "Failed to fetch international accreditations" },
      { status: 500 }
    );
  }
}

// POST - Create new international accreditation
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
    
    const accreditation = await prisma.internationalAccreditation.create({
      data: {
        faculty: data.faculty || data.facultyName,
        studyProgram: data.studyProgram || data.programName,
        accreditationBody: data.accreditationBody || data.agency,
        order: data.order || 0,
        isActive: data.isActive !== undefined ? data.isActive : true,
      },
    });

    return NextResponse.json(accreditation);
  } catch (error) {
    console.error("Error creating international accreditation:", error);
    return NextResponse.json(
      { error: "Failed to create international accreditation" },
      { status: 500 }
    );
  }
}

// PUT - Update international accreditation
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

    const accreditation = await prisma.internationalAccreditation.update({
      where: { id: data.id },
      data: {
        faculty: data.faculty || data.facultyName,
        studyProgram: data.studyProgram || data.programName,
        accreditationBody: data.accreditationBody || data.agency,
        order: data.order,
        isActive: data.isActive,
      },
    });

    return NextResponse.json(accreditation);
  } catch (error) {
    console.error("Error updating international accreditation:", error);
    return NextResponse.json(
      { error: "Failed to update international accreditation" },
      { status: 500 }
    );
  }
}

// DELETE - Delete international accreditation
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

    await prisma.internationalAccreditation.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting international accreditation:", error);
    return NextResponse.json(
      { error: "Failed to delete international accreditation" },
      { status: 500 }
    );
  }
}
