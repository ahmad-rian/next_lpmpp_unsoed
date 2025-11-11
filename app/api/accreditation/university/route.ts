import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Fetch active university accreditations with ordered documents
export async function GET() {
  try {
    const accreditations = await prisma.universityAccreditation.findMany({
      where: { isActive: true },
      include: {
        documents: {
          orderBy: {
            order: "asc",
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
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