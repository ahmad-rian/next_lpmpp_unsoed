import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Fetch all study program accreditations (public)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const rank = searchParams.get("rank");
    const level = searchParams.get("level");

    const where: any = {
      isActive: true,
    };

    if (rank) {
      where.rank = rank;
    }

    if (level) {
      where.level = level;
    }

    const accreditations = await prisma.studyProgramAccreditation.findMany({
      where,
      orderBy: [
        { order: "asc" },
        { studyProgram: "asc" },
      ],
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
