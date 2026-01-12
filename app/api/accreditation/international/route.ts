import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const accreditations = await prisma.internationalAccreditation.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
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