import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { error } = await supabase
      .from("Entry")
      .delete()
      .eq("id", id);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Supabase DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete entry" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    
    // Remove id from body to avoid trying to update it
    const { id: _, ...updateData } = body;
    updateData.updatedAt = new Date().toISOString();

    const { data: entry, error } = await supabase
      .from("Entry")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(entry);
  } catch (error) {
    console.error("Supabase PUT error:", error);
    return NextResponse.json({ error: "Failed to update entry" }, { status: 500 });
  }
}
