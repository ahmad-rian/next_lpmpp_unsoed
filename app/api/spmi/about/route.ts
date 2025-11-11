import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Ambil data SPMI About untuk public
export async function GET() {
  try {
    // Ambil data pertama (harusnya hanya ada 1 record)
    const spmiAbout = await prisma.spmiAbout.findFirst();

    if (!spmiAbout) {
      return NextResponse.json(
        { error: "Data SPMI tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json(spmiAbout);
  } catch (error) {
    console.error("Error fetching SPMI about:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
