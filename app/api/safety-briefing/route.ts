import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// GET - Fetch safety briefing (single record, public)
export async function GET() {
  try {
    let briefing = await prisma.safetyBriefing.findFirst();

    // Create default empty record if none exists
    if (!briefing) {
      briefing = await prisma.safetyBriefing.create({
        data: {
          title: "Safety Briefing LPMPP Building",
        },
      });
    }

    return NextResponse.json(briefing);
  } catch (error) {
    console.error("Error fetching safety briefing:", error);
    return NextResponse.json(
      { error: "Failed to fetch safety briefing" },
      { status: 500 }
    );
  }
}

// PUT - Update safety briefing (admin only)
export async function PUT(request: NextRequest) {
  try {
    const session = await auth();

    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();

    const payload = {
      title: data.title || "Safety Briefing LPMPP Building",
      description: data.description ?? null,
      images: data.images ?? null, // JSON string array
      videos: data.videos ?? null, // JSON string array
    };

    const existing = await prisma.safetyBriefing.findFirst();

    const briefing = existing
      ? await prisma.safetyBriefing.update({
          where: { id: existing.id },
          data: payload,
        })
      : await prisma.safetyBriefing.create({ data: payload });

    return NextResponse.json({
      message: "Safety briefing updated successfully",
      data: briefing,
    });
  } catch (error) {
    console.error("Error updating safety briefing:", error);
    return NextResponse.json(
      { error: "Failed to update safety briefing" },
      { status: 500 }
    );
  }
}
