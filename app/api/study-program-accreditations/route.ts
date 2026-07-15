import { NextRequest, NextResponse } from "next/server";
import { requirePermission } from "@/lib/auth-helpers";
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
    const guard = await requirePermission("accreditation.create");
    if (guard instanceof NextResponse) return guard;

    const data = await request.json();

    const accreditation = await prisma.studyProgramAccreditation.create({
      data: {
        studyProgram: data.studyProgram || data.programName,
        level: data.level,
        faculty: data.faculty || null,
        korprodi: data.korprodi || null,
        skNumber: data.skNumber || null,
        skYear: data.skYear ? parseInt(data.skYear) : null,
        rank: data.rank || data.rating || null,
        validFrom: data.validFrom ? new Date(data.validFrom) : null,
        validUntil: data.validUntil ? new Date(data.validUntil) : null,
        certificateUrl: data.certificateUrl || null,
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
    const guard = await requirePermission("accreditation.update");
    if (guard instanceof NextResponse) return guard;

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
        faculty: data.faculty || null,
        korprodi: data.korprodi || null,
        skNumber: data.skNumber || null,
        skYear: data.skYear ? parseInt(data.skYear) : null,
        rank: data.rank || data.rating || null,
        validFrom: data.validFrom ? new Date(data.validFrom) : null,
        validUntil: data.validUntil ? new Date(data.validUntil) : null,
        certificateUrl: data.certificateUrl || null,
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
    const guard = await requirePermission("accreditation.delete");
    if (guard instanceof NextResponse) return guard;

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
