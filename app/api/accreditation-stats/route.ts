import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Get accreditation statistics for chart
export async function GET() {
  try {
    const accreditations = await prisma.studyProgramAccreditation.findMany({
      where: { isActive: true },
      select: { rating: true },
    });

    // Count by rating
    const stats = accreditations.reduce((acc: Record<string, number>, curr) => {
      acc[curr.rating] = (acc[curr.rating] || 0) + 1;
      return acc;
    }, {});

    // Format for chart
    const chartData = [
      { name: 'UNGGUL', value: stats['UNGGUL'] || 0 },
      { name: 'BAIK SEKALI', value: stats['BAIK SEKALI'] || stats['Baik Sekali'] || 0 },
      { name: 'BAIK', value: stats['BAIK'] || stats['Baik'] || 0 },
      { name: 'TERAKREDITASI SEMENTARA', value: stats['TERAKREDITASI SEMENTARA'] || stats['Terakreditasi Sementara'] || 0 },
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
