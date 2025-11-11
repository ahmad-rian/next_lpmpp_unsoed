import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Public API untuk mendapatkan data SPMI About
export async function GET() {
  try {
    const spmiAbout = await prisma.spmiAbout.findFirst();

    if (!spmiAbout) {
      return NextResponse.json({
        title: "SPM Unsoed",
        tujuan: "Data tujuan SPMI belum tersedia",
        fungsi: "Data fungsi SPMI belum tersedia",
      });
    }

    return NextResponse.json(spmiAbout);
  } catch (error) {
    console.error("Error fetching SPMI about:", error);
    return NextResponse.json(
      { error: "Failed to fetch SPMI data" },
      { status: 500 }
    );
  }
}
