import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Public Gallery API: returns active gallery images, ordered by `order` asc and `createdAt` desc
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limitParam = searchParams.get("limit");
    const pageParam = searchParams.get("page");
    const pageSizeParam = searchParams.get("pageSize");

    const page = Math.max(1, Number(pageParam) || 1);
    const pageSize = Math.min(
      1000,
      Math.max(1, Number(limitParam) || Number(pageSizeParam) || 24)
    );

    const items = await prisma.dataGaleri.findMany({
      where: { isActive: true },
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
      skip: (page - 1) * pageSize,
      take: pageSize,
      select: {
        id: true,
        gambar: true,
        judul: true,
      },
    });

    return NextResponse.json(items);
  } catch (error) {
    console.error("Error fetching gallery:", error);
    return NextResponse.json({ error: "Failed to fetch gallery" }, { status: 500 });
  }
}