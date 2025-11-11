import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Get accreditation statistics for chart
export async function GET() {
  try {
    const accreditations = await prisma.studyProgramAccreditation.findMany({
      where: { isActive: true },
      select: { rank: true },
    });

    // Count by rank
    const stats = accreditations.reduce((acc: Record<string, number>, curr) => {
      if (curr.rank) {
        acc[curr.rank] = (acc[curr.rank] || 0) + 1;
      }
      return acc;
    }, {});

    // Format for chart
    const chartData = [
      { name: 'UNGGUL', value: stats['UNGGUL'] || 0 },
      { name: 'BAIK SEKALI', value: stats['BAIK_SEKALI'] || 0 },
      { name: 'BAIK', value: stats['BAIK'] || 0 },
      { name: 'TERAKREDITASI SEMENTARA', value: stats['TERAKREDITASI_SEMENTARA'] || 0 },
      { name: 'A', value: stats['A'] || 0 },
      { name: 'B', value: stats['B'] || 0 },
      { name: 'C', value: stats['C'] || 0 },
    ];

    return NextResponse.json(chartData);
  } catch (error) {
    console.error("Error fetching accreditation stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch accreditation statistics" },
      { status: 500 }
    );
  }
}
