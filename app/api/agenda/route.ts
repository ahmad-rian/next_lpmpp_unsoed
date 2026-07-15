import { NextRequest, NextResponse } from "next/server";
import { requirePermission } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";

// GET - Fetch all agendas
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const month = searchParams.get("month");
        const year = searchParams.get("year");
        const activeOnly = searchParams.get("activeOnly") === "true";

        let whereClause: any = {};

        if (activeOnly) {
            whereClause.isActive = true;
        }

        // Filter by month and year if provided
        if (month && year) {
            const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
            const endDate = new Date(parseInt(year), parseInt(month), 0, 23, 59, 59);

            whereClause.date = {
                gte: startDate,
                lte: endDate,
            };
        }

        const agendas = await prisma.agenda.findMany({
            where: whereClause,
            orderBy: [{ date: "asc" }, { startTime: "asc" }],
        });

        return NextResponse.json(agendas);
    } catch (error) {
        console.error("Error fetching agendas");
        return NextResponse.json(
            { error: "Failed to fetch agendas" },
            { status: 500 }
        );
    }
}

// POST - Create new agenda
export async function POST(request: NextRequest) {
    try {
        const guard = await requirePermission("agenda.create");
        if (guard instanceof NextResponse) return guard;

        const data = await request.json();

        const agenda = await prisma.agenda.create({
            data: {
                title: data.title,
                date: new Date(data.date),
                startTime: data.startTime,
                endTime: data.endTime,
                location: data.location,
                description: data.description || null,
                color: data.color || "#f59e0b",
                isActive: data.isActive ?? true,
            },
        });

        return NextResponse.json(agenda);
    } catch (error) {
        console.error("Error creating agenda:", error);
        return NextResponse.json(
            { error: "Failed to create agenda" },
            { status: 500 }
        );
    }
}

// PUT - Update agenda
export async function PUT(request: NextRequest) {
    try {
        const guard = await requirePermission("agenda.update");
        if (guard instanceof NextResponse) return guard;

        const data = await request.json();

        if (!data.id) {
            return NextResponse.json({ error: "ID is required" }, { status: 400 });
        }

        const agenda = await prisma.agenda.update({
            where: { id: data.id },
            data: {
                title: data.title,
                date: new Date(data.date),
                startTime: data.startTime,
                endTime: data.endTime,
                location: data.location,
                description: data.description || null,
                color: data.color || "#f59e0b",
                isActive: data.isActive ?? true,
            },
        });

        return NextResponse.json(agenda);
    } catch (error) {
        console.error("Error updating agenda:", error);
        return NextResponse.json(
            { error: "Failed to update agenda" },
            { status: 500 }
        );
    }
}

// DELETE - Delete agenda
export async function DELETE(request: NextRequest) {
    try {
        const guard = await requirePermission("agenda.delete");
        if (guard instanceof NextResponse) return guard;

        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ error: "ID is required" }, { status: 400 });
        }

        await prisma.agenda.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting agenda:", error);
        return NextResponse.json(
            { error: "Failed to delete agenda" },
            { status: 500 }
        );
    }
}
