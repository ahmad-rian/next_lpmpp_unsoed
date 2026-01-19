import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Migrate old rank values to new ones
// HAPUS FILE INI SETELAH MIGRASI SELESAI!
export async function GET() {
    try {
        // Update all records with old rank value to new rank value
        // Using raw query because the old enum value might not be recognized by Prisma
        const result = await prisma.$executeRaw`
      UPDATE StudyProgramAccreditation 
      SET rank = 'TERAKREDITASI' 
      WHERE rank = 'TERAKREDITASI_SEMENTARA'
    `;

        return NextResponse.json({
            success: true,
            message: `Migrasi berhasil! ${result} record telah diupdate dari TERAKREDITASI_SEMENTARA ke TERAKREDITASI`,
            updatedCount: result,
        });
    } catch (error: any) {
        console.error("Migration error:", error);
        return NextResponse.json(
            {
                success: false,
                error: error.message || "Gagal melakukan migrasi",
            },
            { status: 500 }
        );
    }
}
