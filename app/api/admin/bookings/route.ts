import { NextRequest, NextResponse } from "next/server";
import { getAllBookings } from "@/lib/db";

const ADMIN_PASSWORD = "kateryna2024";

export async function GET(req: NextRequest) {
  const password = req.headers.get("x-admin-password");

  if (password !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const bookings = getAllBookings.all();
    return NextResponse.json({ bookings });
  } catch (error) {
    console.error("Admin bookings error:", error);
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 });
  }
}
