import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// GET - Ambil data galeri berdasarkan ID
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
    const dataGaleri = await prisma.dataGaleri.findUnique({
      where: { id }
    });

    if (!dataGaleri) {
      return NextResponse.json(
        { error: "Foto tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json(dataGaleri);
  } catch (error) {
    console.error("Error fetching data galeri:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data galeri" },
      { status: 500 }
    );
  }
}

// PUT - Update data galeri
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
    const { judul, gambar, deskripsi, isActive } = body;

    // Cek apakah data galeri ada
    const existingDataGaleri = await prisma.dataGaleri.findUnique({
      where: { id }
    });

    if (!existingDataGaleri) {
      return NextResponse.json(
        { error: "Foto tidak ditemukan" },
        { status: 404 }
      );
    }

    // Validasi input jika gambar disediakan
    if (gambar !== undefined && !gambar?.trim()) {
      return NextResponse.json(
        { error: "URL gambar harus diisi" },
        { status: 400 }
      );
    }

    // Update data
    const updatedDataGaleri = await prisma.dataGaleri.update({
      where: { id },
      data: {
        ...(judul !== undefined && { judul: judul?.trim() || null }),
        ...(gambar !== undefined && { gambar: gambar.trim() }),
        ...(deskripsi !== undefined && { deskripsi: deskripsi?.trim() || null }),
        ...(isActive !== undefined && { isActive }),
      }
    });

    return NextResponse.json(updatedDataGaleri);
  } catch (error) {
    console.error("Error updating data galeri:", error);
    return NextResponse.json(
      { error: "Gagal memperbarui foto galeri" },
      { status: 500 }
    );
  }
}

// DELETE - Hapus data galeri
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

    // Cek apakah data galeri ada
    const existingDataGaleri = await prisma.dataGaleri.findUnique({
      where: { id }
    });

    if (!existingDataGaleri) {
      return NextResponse.json(
        { error: "Foto tidak ditemukan" },
        { status: 404 }
      );
    }

    await prisma.dataGaleri.delete({
      where: { id }
    });

    return NextResponse.json(
      { message: "Foto berhasil dihapus" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting data galeri:", error);
    return NextResponse.json(
      { error: "Gagal menghapus foto" },
      { status: 500 }
    );
  }
}
