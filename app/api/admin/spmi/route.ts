import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// GET - Ambil data SPMI About
export async function GET() {
  try {
    const session = await auth();

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Ambil data pertama (harusnya hanya ada 1 record)
    const spmiAbout = await prisma.spmiAbout.findFirst();

    return NextResponse.json(spmiAbout);
  } catch (error) {
    console.error("Error fetching SPMI about:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// POST - Buat data SPMI About baru
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, tujuan, fungsi } = body;

    // Validasi
    if (!title || !tujuan || !fungsi) {
      return NextResponse.json(
        { error: "Title, tujuan, dan fungsi harus diisi" },
        { status: 400 }
      );
    }

    // Cek apakah sudah ada data
    const existingData = await prisma.spmiAbout.findFirst();
    if (existingData) {
      return NextResponse.json(
        { error: "Data SPMI sudah ada, gunakan PUT untuk update" },
        { status: 400 }
      );
    }

    // Buat data baru
    const spmiAbout = await prisma.spmiAbout.create({
      data: {
        title,
        tujuan,
        fungsi,
      },
    });

    return NextResponse.json(spmiAbout, { status: 201 });
  } catch (error) {
    console.error("Error creating SPMI about:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// PUT - Update data SPMI About
export async function PUT(request: NextRequest) {
  try {
    const session = await auth();

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, tujuan, fungsi } = body;

    // Validasi
    if (!title || !tujuan || !fungsi) {
      return NextResponse.json(
        { error: "Title, tujuan, dan fungsi harus diisi" },
        { status: 400 }
      );
    }

    // Ambil data yang ada
    const existingData = await prisma.spmiAbout.findFirst();
    
    if (!existingData) {
      return NextResponse.json(
        { error: "Data SPMI tidak ditemukan" },
        { status: 404 }
      );
    }

    // Update data
    const spmiAbout = await prisma.spmiAbout.update({
      where: { id: existingData.id },
      data: {
        title,
        tujuan,
        fungsi,
      },
    });

    return NextResponse.json(spmiAbout);
  } catch (error) {
    console.error("Error updating SPMI about:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
