import { NextRequest, NextResponse } from "next/server";
import { getBookedSlots } from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date");

  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: "Invalid date" }, { status: 400 });
  }

  try {
    const rows = getBookedSlots.all({ date }) as { appointment_time: string }[];
    const bookedSlots = rows.map((r) => r.appointment_time);
    return NextResponse.json({ bookedSlots });
  } catch (error) {
    console.error("Slots error:", error);
    return NextResponse.json({ error: "Failed to fetch slots" }, { status: 500 });
  }
}
