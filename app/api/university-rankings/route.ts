import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { RankingInstitution } from "@prisma/client";

// GET - Fetch all university rankings
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const institution = searchParams.get("institution") as RankingInstitution | null;
    const activeOnly = searchParams.get("active") !== "false";

    const whereClause: any = {};
    
    if (institution) {
      whereClause.institution = institution;
    }
    
    if (activeOnly) {
      whereClause.isActive = true;
    }

    const rankings = await prisma.universityRanking.findMany({
      where: whereClause,
      orderBy: [
        { institution: "asc" },
        { year: "desc" },
      ],
    });

    return NextResponse.json(rankings);
  } catch (error) {
    console.error("Error fetching university rankings:", error);
    return NextResponse.json(
      { error: "Failed to fetch university rankings" },
      { status: 500 }
    );
  }
}

// POST - Create a new university ranking
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      institution,
      year,
      rankNational,
      rankWorld,
      rankAsia,
      score,
      badge,
      description,
      sourceUrl,
      logoUrl,
      isActive,
    } = body;

    if (!institution || !year) {
      return NextResponse.json(
        { error: "Institution and year are required" },
        { status: 400 }
      );
    }

    const ranking = await prisma.universityRanking.create({
      data: {
        institution,
        year: parseInt(year),
        rankNational: rankNational ? parseInt(rankNational) : null,
        rankWorld: rankWorld ? parseInt(rankWorld) : null,
        rankAsia: rankAsia ? parseInt(rankAsia) : null,
        score: score ? parseFloat(score) : null,
        badge: badge || null,
        description: description || null,
        sourceUrl: sourceUrl || null,
        logoUrl: logoUrl || null,
        isActive: isActive !== undefined ? isActive : true,
      },
    });

    return NextResponse.json(ranking, { status: 201 });
  } catch (error) {
    console.error("Error creating university ranking:", error);
    return NextResponse.json(
      { error: "Failed to create university ranking" },
      { status: 500 }
    );
  }
}

// PUT - Update a university ranking
export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      id,
      institution,
      year,
      rankNational,
      rankWorld,
      rankAsia,
      score,
      badge,
      description,
      sourceUrl,
      logoUrl,
      isActive,
    } = body;

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const ranking = await prisma.universityRanking.update({
      where: { id },
      data: {
        institution,
        year: parseInt(year),
        rankNational: rankNational ? parseInt(rankNational) : null,
        rankWorld: rankWorld ? parseInt(rankWorld) : null,
        rankAsia: rankAsia ? parseInt(rankAsia) : null,
        score: score ? parseFloat(score) : null,
        badge: badge || null,
        description: description || null,
        sourceUrl: sourceUrl || null,
        logoUrl: logoUrl || null,
        isActive: isActive !== undefined ? isActive : true,
      },
    });

    return NextResponse.json(ranking);
  } catch (error) {
    console.error("Error updating university ranking:", error);
    return NextResponse.json(
      { error: "Failed to update university ranking" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a university ranking
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    await prisma.universityRanking.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting university ranking:", error);
    return NextResponse.json(
      { error: "Failed to delete university ranking" },
      { status: 500 }
    );
  }
}
