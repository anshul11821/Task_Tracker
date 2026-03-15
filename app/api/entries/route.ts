import { NextResponse } from "next/server";
import { database } from "@/lib/database";

export async function GET() {
  try {
    const { data: entries, error } = await database
      .from("Entry")
      .select("*")
      .order("date", { ascending: false });

    if (error) throw error;
    return NextResponse.json(entries);
  } catch (error) {
    console.error("Supabase GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch entries", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { date, task, anshul, arsh, shivraj, shruti } = body;

    if (!date || !task) {
      return NextResponse.json({ error: "date and task are required" }, { status: 400 });
    }

    const { data: entry, error } = await database
      .from("Entry")
      .upsert(
        {
          date,
          task,
          anshul: anshul ?? false,
          arsh: arsh ?? false,
          shivraj: shivraj ?? false,
          shruti: shruti ?? false,
          updatedAt: new Date().toISOString(),
        },
        { onConflict: "date,task" }
      )
      .select()
      .single();

    if (error) {
      console.error("Supabase upsert error details:", error);
      throw error;
    }
    return NextResponse.json(entry);
  } catch (error) {
    console.error("Supabase POST error:", error);
    return NextResponse.json({ 
      error: "Failed to upsert entry", 
      details: error instanceof Error ? error.message : JSON.stringify(error) 
    }, { status: 500 });
  }
}
