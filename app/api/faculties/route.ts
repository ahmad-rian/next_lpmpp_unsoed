import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/faculties - Get all faculties
export async function GET() {
  try {
    const faculties = await prisma.faculty.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
    });

    return NextResponse.json(faculties);
  } catch (error) {
    console.error("Error fetching faculties:", error);
    return NextResponse.json(
      { error: "Failed to fetch faculties" },
      { status: 500 }
    );
  }
}
