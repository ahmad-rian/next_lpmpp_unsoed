import { NextRequest, NextResponse } from "next/server";
import { requirePermission } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";

// GET - Ambil semua data galeri
export async function GET() {
  try {
    const guard = await requirePermission("gallery.view");
    if (guard instanceof NextResponse) return guard;

    const dataGaleri = await prisma.dataGaleri.findMany({
      orderBy: [
        { order: "asc" },
        { createdAt: "desc" }
      ]
    });

    return NextResponse.json(dataGaleri);
  } catch (error) {
    console.error("Error fetching data galeri:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data galeri" },
      { status: 500 }
    );
  }
}

// POST - Tambah foto galeri baru
export async function POST(request: NextRequest) {
  try {
    const guard = await requirePermission("gallery.create");
    if (guard instanceof NextResponse) return guard;

    const body = await request.json();
    const { judul, gambar, deskripsi, isActive } = body;

    // Validasi input
    if (!gambar?.trim()) {
      return NextResponse.json(
        { error: "URL gambar harus diisi" },
        { status: 400 }
      );
    }

    // Hitung order berikutnya
    const lastItem = await prisma.dataGaleri.findFirst({
      orderBy: { order: "desc" }
    });
    const nextOrder = (lastItem?.order || 0) + 1;

    const newDataGaleri = await prisma.dataGaleri.create({
      data: {
        judul: judul?.trim() || null,
        gambar: gambar.trim(),
        deskripsi: deskripsi?.trim() || null,
        order: nextOrder,
        isActive: isActive ?? true,
      }
    });

    return NextResponse.json(newDataGaleri, { status: 201 });
  } catch (error) {
    console.error("Error creating data galeri:", error);
    return NextResponse.json(
      { error: "Gagal menambah foto galeri" },
      { status: 500 }
    );
  }
}
