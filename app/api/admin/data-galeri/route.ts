import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// GET - Ambil semua data galeri
export async function GET() {
  try {
    const session = await auth();
    
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

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
    const session = await auth();
    
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

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
