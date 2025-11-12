import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Public API: get one active book by id
export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const book = await prisma.dataBuku.findUnique({
      where: { id: params.id },
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

    if (!book || !book.isActive) {
      return NextResponse.json(
        { error: "Data buku tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json(book);
  } catch (error) {
    console.error("Error fetching public book:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data buku" },
      { status: 500 }
    );
  }
}