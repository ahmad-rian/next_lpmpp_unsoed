import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();

    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [internationalAccreditations, studyProgramAccreditations] = await Promise.all([
      prisma.internationalAccreditation.findMany({
        orderBy: { order: "asc" },
      }),
      prisma.studyProgramAccreditation.findMany({
        orderBy: { order: "asc" },
      }),
    ]);

    return NextResponse.json({
      internationalAccreditations,
      studyProgramAccreditations,
    });
  } catch (error) {
    console.error("Error fetching accreditation data:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth();

    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { internationalAccreditations, studyProgramAccreditations } = body;

    // Update international accreditations
    if (internationalAccreditations) {
      for (const accreditation of internationalAccreditations) {
        await prisma.internationalAccreditation.update({
          where: { id: accreditation.id },
          data: {
            faculty: accreditation.faculty,
            studyProgram: accreditation.studyProgram,
            accreditationBody: accreditation.accreditationBody,
            order: accreditation.order,
            isActive: accreditation.isActive,
          },
        });
      }
    }

    // Update study program accreditations
    if (studyProgramAccreditations) {
      for (const accreditation of studyProgramAccreditations) {
        await prisma.studyProgramAccreditation.update({
          where: { id: accreditation.id },
          data: {
            studyProgram: accreditation.studyProgram,
            level: accreditation.level,
            skNumber: accreditation.skNumber,
            skYear: accreditation.skYear,
            rank: accreditation.rank,
            order: accreditation.order,
            isActive: accreditation.isActive,
          },
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating accreditation data:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
