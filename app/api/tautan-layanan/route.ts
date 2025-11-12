import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Public API: Ambil daftar tautan layanan aktif untuk homepage
export async function GET() {
  try {
    const items = await prisma.tautanLayanan.findMany({
      where: { isActive: true },
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
      select: {
        id: true,
        nama: true,
        gambar: true,
        link: true,
        order: true,
        isActive: true,
      },
    });

    return NextResponse.json(items);
  } catch (error) {
    console.error("Error fetching public tautan layanan:", error);
    return NextResponse.json(
      { error: "Gagal mengambil tautan layanan" },
      { status: 500 }
    );
  }
}