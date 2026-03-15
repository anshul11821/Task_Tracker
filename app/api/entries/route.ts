import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    console.log("DATABASE_URL present:", !!process.env.DATABASE_URL);
    const entries = await prisma.entry.findMany({
      orderBy: { date: "desc" },
    });
    return NextResponse.json(entries);
  } catch (error) {
    console.error("Prisma GET error:", error);
    return NextResponse.json({ error: "Failed to fetch entries", details: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { date, task, anshul, arsh, shivraj, shruti } = body;

    if (!date || !task) {
      return NextResponse.json({ error: "date and task are required" }, { status: 400 });
    }

    const entry = await prisma.entry.upsert({
      where: {
        date_task: { date, task },
      },
      update: {
        anshul: anshul ?? false,
        arsh: arsh ?? false,
        shivraj: shivraj ?? false,
        shruti: shruti ?? false,
      },
      create: {
        date,
        task,
        anshul: anshul ?? false,
        arsh: arsh ?? false,
        shivraj: shivraj ?? false,
        shruti: shruti ?? false,
      },
    });

    return NextResponse.json(entry);
  } catch (error) {
    return NextResponse.json({ error: "Failed to upsert entry" }, { status: 500 });
  }
}
