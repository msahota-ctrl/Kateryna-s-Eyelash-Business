import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

const DB_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DB_DIR, "bookings.db");

// Ensure data directory exists
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

const db = new Database(DB_PATH);

// Enable WAL mode for better concurrent read performance
db.pragma("journal_mode = WAL");

// Create bookings table
db.exec(`
  CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    stripe_session_id TEXT UNIQUE NOT NULL,
    service_name TEXT NOT NULL,
    service_price INTEGER NOT NULL,
    appointment_date TEXT NOT NULL,
    appointment_time TEXT NOT NULL,
    client_name TEXT NOT NULL,
    client_email TEXT NOT NULL,
    client_phone TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )
`);

export interface Booking {
  id: number;
  stripe_session_id: string;
  service_name: string;
  service_price: number;
  appointment_date: string;
  appointment_time: string;
  client_name: string;
  client_email: string;
  client_phone: string;
  status: "pending" | "confirmed";
  created_at: string;
}

export const insertBooking = db.prepare<
  Omit<Booking, "id" | "created_at" | "status">
>(`
  INSERT OR IGNORE INTO bookings
    (stripe_session_id, service_name, service_price, appointment_date, appointment_time, client_name, client_email, client_phone, status)
  VALUES
    (@stripe_session_id, @service_name, @service_price, @appointment_date, @appointment_time, @client_name, @client_email, @client_phone, 'confirmed')
`);

export const getBookedSlots = db.prepare<{ date: string }>(`
  SELECT appointment_time FROM bookings
  WHERE appointment_date = @date AND status = 'confirmed'
`);

export const getAllBookings = db.prepare(`
  SELECT * FROM bookings ORDER BY appointment_date DESC, appointment_time ASC
`);

export default db;
