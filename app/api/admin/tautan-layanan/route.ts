import { NextRequest, NextResponse } from "next/server";
import { requirePermission } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";

// GET - Ambil semua tautan layanan
export async function GET() {
  try {
    const guard = await requirePermission("tautan-layanan.view");
    if (guard instanceof NextResponse) return guard;

    const tautanLayanan = await prisma.tautanLayanan.findMany({
      orderBy: [
        { order: "asc" },
        { createdAt: "desc" }
      ]
    });

    return NextResponse.json(tautanLayanan);
  } catch (error) {
    console.error("Error fetching tautan layanan:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data tautan layanan" },
      { status: 500 }
    );
  }
}

// POST - Tambah tautan layanan baru
export async function POST(request: NextRequest) {
  try {
    const guard = await requirePermission("tautan-layanan.create");
    if (guard instanceof NextResponse) return guard;

    const body = await request.json();
    const { nama, gambar, link, deskripsi, isActive } = body;

    // Validasi input
    if (!nama?.trim()) {
      return NextResponse.json(
        { error: "Nama layanan harus diisi" },
        { status: 400 }
      );
    }

    if (!link?.trim()) {
      return NextResponse.json(
        { error: "Link layanan harus diisi" },
        { status: 400 }
      );
    }

    // Hitung order berikutnya
    const lastItem = await prisma.tautanLayanan.findFirst({
      orderBy: { order: "desc" }
    });
    const nextOrder = (lastItem?.order || 0) + 1;

    const newTautanLayanan = await prisma.tautanLayanan.create({
      data: {
        nama: nama.trim(),
        gambar: gambar?.trim() || null,
        link: link.trim(),
        deskripsi: deskripsi?.trim() || null,
        order: nextOrder,
        isActive: isActive ?? true,
      }
    });

    return NextResponse.json(newTautanLayanan, { status: 201 });
  } catch (error) {
    console.error("Error creating tautan layanan:", error);
    return NextResponse.json(
      { error: "Gagal menambah tautan layanan" },
      { status: 500 }
    );
  }
}
