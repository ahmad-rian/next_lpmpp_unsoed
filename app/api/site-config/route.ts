import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";

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

    // Don't expose password hash, only boolean flag
    const { spmiPassword, ...configWithoutPassword } = config;
    return NextResponse.json({
      ...configWithoutPassword,
      hasSpmiPassword: !!spmiPassword,
    });
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

    // Handle SPMI password
    let spmiPasswordUpdate: { spmiPassword?: string | null } = {};
    if (data.spmiPasswordNew !== undefined) {
      if (data.spmiPasswordNew === "" || data.spmiPasswordNew === null) {
        // Clear password protection
        spmiPasswordUpdate = { spmiPassword: null };
      } else {
        // Hash and set new password
        spmiPasswordUpdate = { spmiPassword: await hash(data.spmiPasswordNew, 10) };
      }
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
          tagline: data.tagline,
          motto: data.motto,
          headMessage: data.headMessage,
          visi: data.visi,
          misi: data.misi,
          visiUnsoed: data.visiUnsoed,
          misiUnsoed: data.misiUnsoed,
          tugas: data.tugas,
          fungsi: data.fungsi,
          alamat: data.alamat,
          email: data.email,
          instagramUrl: data.instagramUrl,
          carouselImages: data.carouselImages,
          
          // Field tambahan untuk halaman utama
          gambarTeam: data.gambarTeam,
          gambarSlogan: data.gambarSlogan,
          gambarTambahan: data.gambarTambahan,
          
          // Detail Layanan LPMPP
          layananKami: data.layananKami,
          pelatihan: data.pelatihan,
          pembelajaran: data.pembelajaran,
          penjaminanMutu: data.penjaminanMutu,
          
          // Informasi dan Layanan
          informasiLayanan: data.informasiLayanan,
          gambarInformasi: data.gambarInformasi,
          gambarStaff: data.gambarStaff,
          gambarPartner: data.gambarPartner,
          ...spmiPasswordUpdate,
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
          tagline: data.tagline,
          motto: data.motto,
          headMessage: data.headMessage,
          visi: data.visi,
          misi: data.misi,
          visiUnsoed: data.visiUnsoed,
          misiUnsoed: data.misiUnsoed,
          tugas: data.tugas,
          fungsi: data.fungsi,
          alamat: data.alamat,
          email: data.email,
          instagramUrl: data.instagramUrl,
          carouselImages: data.carouselImages,
          
          // Field tambahan untuk halaman utama
          gambarTeam: data.gambarTeam,
          gambarSlogan: data.gambarSlogan,
          gambarTambahan: data.gambarTambahan,
          
          // Detail Layanan LPMPP
          layananKami: data.layananKami,
          pelatihan: data.pelatihan,
          pembelajaran: data.pembelajaran,
          penjaminanMutu: data.penjaminanMutu,
          
          // Informasi dan Layanan
          informasiLayanan: data.informasiLayanan,
          gambarInformasi: data.gambarInformasi,
          gambarStaff: data.gambarStaff,
          gambarPartner: data.gambarPartner,
          ...spmiPasswordUpdate,
        },
      });
    }

    // Don't expose password hash in response
    const { spmiPassword: _pwd, ...responseData } = config;
    return NextResponse.json({
      message: "Site configuration updated successfully",
      data: { ...responseData, hasSpmiPassword: !!_pwd },
    });
  } catch (error) {
    console.error("Error updating site config:", error);
    return NextResponse.json(
      { error: "Failed to update site configuration" },
      { status: 500 }
    );
  }
}
