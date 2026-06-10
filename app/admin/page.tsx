"use client";

import { useState } from "react";
import Link from "next/link";

interface Booking {
  id: number;
  stripe_session_id: string;
  service_name: string;
  service_price: number;
  appointment_date: string;
  appointment_time: string;
  client_name: string;
  client_email: string;
  client_phone: string;
  status: string;
  created_at: string;
}

function formatTime(timeStr: string): string {
  const [hourStr] = timeStr.split(":");
  const hour = parseInt(hourStr, 10);
  const suffix = hour >= 12 ? "PM" : "AM";
  const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
  return `${displayHour}:00 ${suffix}`;
}

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/bookings", {
        headers: { "x-admin-password": password },
      });

      if (!res.ok) {
        setError("Incorrect password. Please try again.");
        setLoading(false);
        return;
      }

      const data = await res.json();
      setBookings(data.bookings);
      setIsAuthenticated(true);
    } catch {
      setError("Failed to connect. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/bookings", {
        headers: { "x-admin-password": password },
      });
      const data = await res.json();
      setBookings(data.bookings);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-rose-gold-bg flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <p className="text-rose-gold text-xs tracking-[0.3em] uppercase font-medium mb-2">
              Beauty Studio
            </p>
            <h1 className="font-serif text-3xl text-gray-800 mb-1">
              Kateryna&apos;s Lashes
            </h1>
            <p className="text-gray-500 text-sm">Admin Portal</p>
          </div>

          <div className="bg-white rounded-2xl shadow-soft-md border border-rose-gold/10 p-8">
            <div className="flex items-center justify-center w-14 h-14 rounded-full bg-rose-gold/10 mx-auto mb-6">
              <svg
                className="w-7 h-7 text-rose-gold"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                />
              </svg>
            </div>

            <h2 className="font-serif text-xl text-gray-800 text-center mb-6">
              Sign In
            </h2>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs text-gray-500 uppercase tracking-wide font-medium mb-1.5">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field"
                  placeholder="Enter admin password"
                  required
                />
              </div>

              {error && (
                <p className="text-red-500 text-sm text-center">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full"
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>
          </div>

          <div className="text-center mt-6">
            <Link
              href="/"
              className="text-rose-gold text-sm hover:text-rose-gold-dark transition-colors"
            >
              ← Back to Booking
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const confirmedCount = bookings.filter((b) => b.status === "confirmed").length;
  const totalRevenue = bookings
    .filter((b) => b.status === "confirmed")
    .reduce((sum, b) => sum + b.service_price, 0);

  return (
    <main className="min-h-screen bg-rose-gold-bg">
      {/* Header */}
      <header className="bg-white border-b border-rose-gold/10 shadow-soft">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <p className="text-rose-gold text-xs tracking-[0.3em] uppercase font-medium">
              Beauty Studio
            </p>
            <h1 className="font-serif text-2xl text-gray-800">
              Kateryna&apos;s Lashes — Admin
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="btn-outline text-xs px-4 py-2"
            >
              {loading ? "Refreshing..." : "Refresh"}
            </button>
            <Link href="/" className="text-gray-500 text-sm hover:text-rose-gold transition-colors">
              ← Back to Site
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl shadow-soft p-6 border border-rose-gold/10">
            <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">Total Bookings</p>
            <p className="font-serif text-3xl text-gray-800 mt-1">{bookings.length}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-soft p-6 border border-rose-gold/10">
            <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">Confirmed</p>
            <p className="font-serif text-3xl text-gray-800 mt-1">{confirmedCount}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-soft p-6 border border-rose-gold/10">
            <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">Total Revenue</p>
            <p className="font-serif text-3xl text-rose-gold mt-1">${totalRevenue}</p>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-soft border border-rose-gold/10 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="font-serif text-xl text-gray-800">All Bookings</h2>
          </div>

          {bookings.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-gray-400">No bookings yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-rose-gold-bg">
                    <th className="text-left px-4 py-3 text-xs text-gray-500 uppercase tracking-wide font-medium">
                      Client
                    </th>
                    <th className="text-left px-4 py-3 text-xs text-gray-500 uppercase tracking-wide font-medium">
                      Service
                    </th>
                    <th className="text-left px-4 py-3 text-xs text-gray-500 uppercase tracking-wide font-medium">
                      Date & Time
                    </th>
                    <th className="text-left px-4 py-3 text-xs text-gray-500 uppercase tracking-wide font-medium">
                      Price
                    </th>
                    <th className="text-left px-4 py-3 text-xs text-gray-500 uppercase tracking-wide font-medium">
                      Status
                    </th>
                    <th className="text-left px-4 py-3 text-xs text-gray-500 uppercase tracking-wide font-medium">
                      Booked At
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {bookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-rose-gold-bg/50 transition-colors">
                      <td className="px-4 py-4">
                        <p className="font-medium text-gray-800">{booking.client_name}</p>
                        <p className="text-gray-400 text-xs mt-0.5">{booking.client_email}</p>
                        <p className="text-gray-400 text-xs">{booking.client_phone}</p>
                      </td>
                      <td className="px-4 py-4 text-gray-700">{booking.service_name}</td>
                      <td className="px-4 py-4">
                        <p className="text-gray-800">{booking.appointment_date}</p>
                        <p className="text-gray-400 text-xs mt-0.5">
                          {formatTime(booking.appointment_time)}
                        </p>
                      </td>
                      <td className="px-4 py-4 text-gray-800 font-medium">
                        ${booking.service_price}
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                            booking.status === "confirmed"
                              ? "bg-green-50 text-green-700"
                              : "bg-yellow-50 text-yellow-700"
                          }`}
                        >
                          {booking.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-gray-400 text-xs">
                        {new Date(booking.created_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
