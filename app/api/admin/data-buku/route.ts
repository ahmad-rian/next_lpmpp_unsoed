import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// GET - Ambil semua data buku
export async function GET() {
  try {
    const session = await auth();
    
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const dataBuku = await prisma.dataBuku.findMany({
      orderBy: [
        { order: "asc" },
        { createdAt: "desc" }
      ]
    });

    return NextResponse.json(dataBuku);
  } catch (error) {
    console.error("Error fetching data buku:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data buku" },
      { status: 500 }
    );
  }
}

// POST - Tambah data buku baru
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
    const { judul, deskripsi, cover, linkBuku, urutan, isActive } = body;

    // Validasi input
    if (!judul?.trim()) {
      return NextResponse.json(
        { error: "Judul harus diisi" },
        { status: 400 }
      );
    }

    const newDataBuku = await prisma.dataBuku.create({
      data: {
        judul: judul.trim(),
        deskripsi: deskripsi?.trim() || null,
        gambar: cover?.trim() || null,
        link: linkBuku?.trim() || null,
        order: urutan || 0,
        isActive: isActive ?? true,
      }
    });

    return NextResponse.json(newDataBuku, { status: 201 });
  } catch (error) {
    console.error("Error creating data buku:", error);
    return NextResponse.json(
      { error: "Gagal menambah data buku" },
      { status: 500 }
    );
  }
}
