import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [internationalAccreditations, studyProgramAccreditations] = await Promise.all([
      prisma.internationalAccreditation.findMany({
        where: { isActive: true },
        orderBy: { order: "asc" },
      }),
      prisma.studyProgramAccreditation.findMany({
        where: { isActive: true },
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
