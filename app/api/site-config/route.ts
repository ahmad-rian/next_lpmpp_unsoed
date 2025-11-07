import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// GET - Fetch site config
export async function GET() {
  try {
    // Get first config (should only be one)
    let config = await prisma.siteConfig.findFirst();

    // If no config exists, create default
    if (!config) {
      config = await prisma.siteConfig.create({
        data: {
          siteName: "LPMPP UNSOED",
          visi: "Menjadi lembaga pengembangan yang unggul di bidang pendidikan dan pembelajaran",
          misi: "Mengembangkan kualitas pendidikan dan pembelajaran di lingkungan Universitas Jenderal Soedirman",
        },
      });
    }

    return NextResponse.json(config);
  } catch (error) {
    console.error("Error fetching site config:", error);
    return NextResponse.json(
      { error: "Failed to fetch site configuration" },
      { status: 500 }
    );
  }
}

// PUT - Update site config
export async function PUT(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    
    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const data = await request.json();
    
    // Validate required fields
    if (!data.siteName) {
      return NextResponse.json(
        { error: "Site name is required" },
        { status: 400 }
      );
    }

    // Get existing config
    const existingConfig = await prisma.siteConfig.findFirst();

    let config;
    if (existingConfig) {
      // Update existing
      config = await prisma.siteConfig.update({
        where: { id: existingConfig.id },
        data: {
          logoUnsoed: data.logoUnsoed,
          logoApp: data.logoApp,
          logoDescription: data.logoDescription,
          siteName: data.siteName,
          visi: data.visi,
          misi: data.misi,
          tugas: data.tugas,
          fungsi: data.fungsi,
          alamat: data.alamat,
          email: data.email,
          instagramUrl: data.instagramUrl,
          carouselImages: data.carouselImages,
        },
      });
    } else {
      // Create new
      config = await prisma.siteConfig.create({
        data: {
          logoUnsoed: data.logoUnsoed,
          logoApp: data.logoApp,
          logoDescription: data.logoDescription,
          siteName: data.siteName,
          visi: data.visi,
          misi: data.misi,
          tugas: data.tugas,
          fungsi: data.fungsi,
          alamat: data.alamat,
          email: data.email,
          instagramUrl: data.instagramUrl,
          carouselImages: data.carouselImages,
        },
      });
    }

    return NextResponse.json({
      message: "Site configuration updated successfully",
      data: config,
    });
  } catch (error) {
    console.error("Error updating site config:", error);
    return NextResponse.json(
      { error: "Failed to update site configuration" },
      { status: 500 }
    );
  }
}
