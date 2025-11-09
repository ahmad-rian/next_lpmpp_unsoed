import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// GET - Ambil tautan layanan berdasarkan ID
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
    const tautanLayanan = await prisma.tautanLayanan.findUnique({
      where: { id }
    });

    if (!tautanLayanan) {
      return NextResponse.json(
        { error: "Tautan layanan tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json(tautanLayanan);
  } catch (error) {
    console.error("Error fetching tautan layanan:", error);
    return NextResponse.json(
      { error: "Gagal mengambil tautan layanan" },
      { status: 500 }
    );
  }
}

// PUT - Update tautan layanan
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
    const { nama, gambar, link, deskripsi, isActive } = body;

    // Cek apakah tautan layanan ada
    const existingTautanLayanan = await prisma.tautanLayanan.findUnique({
      where: { id }
    });

    if (!existingTautanLayanan) {
      return NextResponse.json(
        { error: "Tautan layanan tidak ditemukan" },
        { status: 404 }
      );
    }

    // Validasi input jika disediakan
    if (nama !== undefined && !nama?.trim()) {
      return NextResponse.json(
        { error: "Nama layanan harus diisi" },
        { status: 400 }
      );
    }

    if (link !== undefined && !link?.trim()) {
      return NextResponse.json(
        { error: "Link layanan harus diisi" },
        { status: 400 }
      );
    }

    // Update data
    const updatedTautanLayanan = await prisma.tautanLayanan.update({
      where: { id },
      data: {
        ...(nama !== undefined && { nama: nama.trim() }),
        ...(gambar !== undefined && { gambar: gambar?.trim() || null }),
        ...(link !== undefined && { link: link.trim() }),
        ...(deskripsi !== undefined && { deskripsi: deskripsi?.trim() || null }),
        ...(isActive !== undefined && { isActive }),
      }
    });

    return NextResponse.json(updatedTautanLayanan);
  } catch (error) {
    console.error("Error updating tautan layanan:", error);
    return NextResponse.json(
      { error: "Gagal memperbarui tautan layanan" },
      { status: 500 }
    );
  }
}

// DELETE - Hapus tautan layanan
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
    
    // Cek apakah tautan layanan ada
    const existingTautanLayanan = await prisma.tautanLayanan.findUnique({
      where: { id }
    });

    if (!existingTautanLayanan) {
      return NextResponse.json(
        { error: "Tautan layanan tidak ditemukan" },
        { status: 404 }
      );
    }

    await prisma.tautanLayanan.delete({
      where: { id }
    });

    return NextResponse.json(
      { message: "Tautan layanan berhasil dihapus" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting tautan layanan:", error);
    return NextResponse.json(
      { error: "Gagal menghapus tautan layanan" },
      { status: 500 }
    );
  }
}
