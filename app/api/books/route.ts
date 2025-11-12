import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Public API: list active books (DataBuku)
export async function GET() {
  try {
    const books = await prisma.dataBuku.findMany({
      where: { isActive: true },
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
      select: {
        id: true,
        judul: true,
        deskripsi: true,
        gambar: true,
        link: true,
        order: true,
        isActive: true,
        createdAt: true,
      },
    });
    return NextResponse.json(books);
  } catch (error) {
    console.error("Error fetching public books:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data buku" },
      { status: 500 }
    );
  }
}