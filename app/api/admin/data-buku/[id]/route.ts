import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// GET - Ambil data buku berdasarkan ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const dataBuku = await prisma.dataBuku.findUnique({
      where: { id }
    });

    if (!dataBuku) {
      return NextResponse.json(
        { error: "Data buku tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json(dataBuku);
  } catch (error) {
    console.error("Error fetching data buku:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT - Update data buku
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const { judul, deskripsi, cover, linkBuku, urutan, isActive } = body;
    
    // Validasi data
    if (!judul?.trim()) {
      return NextResponse.json(
        { error: "Judul harus diisi" },
        { status: 400 }
      );
    }

    const updatedData = await prisma.dataBuku.update({
      where: { id },
      data: {
        judul: judul.trim(),
        deskripsi: deskripsi?.trim() || null,
        gambar: cover?.trim() || null,
        link: linkBuku?.trim() || null,
        order: urutan || 0,
        isActive: isActive ?? true,
      }
    });

    return NextResponse.json(updatedData);
  } catch (error) {
    console.error("Error updating data buku:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE - Hapus data buku
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;
    
    // Check if data exists
    const existingData = await prisma.dataBuku.findUnique({
      where: { id }
    });

    if (!existingData) {
      return NextResponse.json(
        { error: "Data buku tidak ditemukan" },
        { status: 404 }
      );
    }

    await prisma.dataBuku.delete({
      where: { id }
    });

    return NextResponse.json({ message: "Data buku berhasil dihapus" });
  } catch (error) {
    console.error("Error deleting data buku:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
