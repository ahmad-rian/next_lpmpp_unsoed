import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// GET - Fetch all study program accreditations
export async function GET() {
  try {
    const accreditations = await prisma.studyProgramAccreditation.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
    });

    return NextResponse.json(accreditations);
  } catch (error) {
    console.error("Error fetching study program accreditations:", error);
    return NextResponse.json(
      { error: "Failed to fetch study program accreditations" },
      { status: 500 }
    );
  }
}

// POST - Create new study program accreditation
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
    
    const accreditation = await prisma.studyProgramAccreditation.create({
      data: {
        studyProgram: data.studyProgram || data.programName,
        level: data.level,
        skNumber: data.skNumber || null,
        skYear: data.skYear ? parseInt(data.skYear) : null,
        rank: data.rank || data.rating || null,
        order: data.order || 0,
        isActive: data.isActive !== undefined ? data.isActive : true,
      },
    });

    return NextResponse.json(accreditation);
  } catch (error) {
    console.error("Error creating study program accreditation:", error);
    return NextResponse.json(
      { error: "Failed to create study program accreditation" },
      { status: 500 }
    );
  }
}

// PUT - Update study program accreditation
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

    const accreditation = await prisma.studyProgramAccreditation.update({
      where: { id: data.id },
      data: {
        studyProgram: data.studyProgram || data.programName,
        level: data.level,
        skNumber: data.skNumber || null,
        skYear: data.skYear ? parseInt(data.skYear) : null,
        rank: data.rank || data.rating || null,
        order: data.order,
        isActive: data.isActive,
      },
    });

    return NextResponse.json(accreditation);
  } catch (error) {
    console.error("Error updating study program accreditation:", error);
    return NextResponse.json(
      { error: "Failed to update study program accreditation" },
      { status: 500 }
    );
  }
}

// DELETE - Delete study program accreditation
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

    await prisma.studyProgramAccreditation.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting study program accreditation:", error);
    return NextResponse.json(
      { error: "Failed to delete study program accreditation" },
      { status: 500 }
    );
  }
}
