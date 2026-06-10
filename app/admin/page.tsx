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

const labelStyle: React.CSSProperties = {
  fontFamily: "'Montserrat', sans-serif",
  fontSize: "0.6rem",
  letterSpacing: "0.15em",
  textTransform: "uppercase",
  color: "#888",
  fontWeight: 400,
  display: "block",
  marginBottom: "0.4rem",
};

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

  // ── Login screen ───────────────────────────────────────────────────────────

  if (!isAuthenticated) {
    return (
      <main
        style={{
          minHeight: "100vh",
          backgroundColor: "#0A0A0A",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "1rem",
        }}
        className="jungle-bg"
      >
        <div style={{ width: "100%", maxWidth: "420px" }}>
          {/* Wordmark */}
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <p
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontSize: "0.55rem",
                letterSpacing: "0.35em",
                textTransform: "uppercase",
                color: "#F4A0B5",
                fontWeight: 400,
                marginBottom: "0.6rem",
              }}
            >
              Beauty Studio
            </p>
            <h1
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontWeight: 300,
                fontSize: "1.9rem",
                color: "#FFFFFF",
                letterSpacing: "0.06em",
                marginBottom: "0.5rem",
              }}
            >
              Kateryna&apos;s Laser &amp; Lash
            </h1>
            <div
              style={{
                width: "30px",
                height: "1px",
                backgroundColor: "#F4A0B5",
                margin: "0 auto 0.5rem",
              }}
            />
            <p
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontSize: "0.65rem",
                fontWeight: 300,
                color: "rgba(255,255,255,0.35)",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
              }}
            >
              Admin Portal
            </p>
          </div>

          {/* Login card */}
          <div
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: "2px",
              padding: "2.5rem",
              border: "1px solid #efefef",
            }}
          >
            {/* Lock icon */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "44px",
                height: "44px",
                border: "1px solid #F4A0B5",
                borderRadius: "50%",
                margin: "0 auto 1.5rem",
              }}
            >
              <svg width="18" height="18" fill="none" stroke="#F4A0B5" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                />
              </svg>
            </div>

            <h2
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontWeight: 400,
                fontSize: "1.4rem",
                color: "#0A0A0A",
                textAlign: "center",
                marginBottom: "1.75rem",
                letterSpacing: "0.03em",
              }}
            >
              Sign In
            </h2>

            <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <div>
                <label style={labelStyle}>Password</label>
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
                <p
                  style={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontSize: "0.72rem",
                    color: "#f87171",
                    textAlign: "center",
                    fontWeight: 300,
                  }}
                >
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn-elegant"
                style={{ width: "100%", opacity: loading ? 0.5 : 1 }}
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>
          </div>

          <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
            <Link
              href="/"
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontSize: "0.62rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "rgba(244,160,181,0.6)",
                textDecoration: "none",
                fontWeight: 300,
                transition: "color 0.2s ease",
              }}
            >
              ← Back to Booking
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // ── Dashboard ──────────────────────────────────────────────────────────────

  const confirmedCount = bookings.filter((b) => b.status === "confirmed").length;
  const totalRevenue = bookings
    .filter((b) => b.status === "confirmed")
    .reduce((sum, b) => sum + b.service_price, 0);

  return (
    <main style={{ minHeight: "100vh", backgroundColor: "#FDF0F4" }}>
      {/* Black top bar */}
      <header
        style={{
          backgroundColor: "#0A0A0A",
          padding: "0 1.5rem",
        }}
      >
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: "64px",
          }}
        >
          <div>
            <p
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontSize: "0.55rem",
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                color: "#F4A0B5",
                fontWeight: 400,
              }}
            >
              Beauty Studio
            </p>
            <h1
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontWeight: 300,
                fontSize: "1.25rem",
                color: "#FFFFFF",
                letterSpacing: "0.04em",
              }}
            >
              Kateryna&apos;s Laser &amp; Lash — Admin
            </h1>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <button
              onClick={handleRefresh}
              disabled={loading}
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontSize: "0.6rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                backgroundColor: "transparent",
                color: "#F4A0B5",
                border: "1px solid rgba(244,160,181,0.4)",
                padding: "0.45rem 1rem",
                borderRadius: "2px",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.5 : 1,
                transition: "all 0.2s ease",
              }}
            >
              {loading ? "Refreshing..." : "Refresh"}
            </button>
            <Link
              href="/"
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontSize: "0.6rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.4)",
                textDecoration: "none",
                transition: "color 0.2s ease",
              }}
            >
              ← Back to Site
            </Link>
          </div>
        </div>
      </header>

      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "2.5rem 1.5rem",
        }}
      >
        {/* Stat cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "1rem",
            marginBottom: "2.5rem",
          }}
        >
          {[
            { label: "Total Bookings", value: bookings.length, color: "#0A0A0A" },
            { label: "Confirmed", value: confirmedCount, color: "#0A0A0A" },
            { label: "Total Revenue", value: `$${totalRevenue}`, color: "#F4A0B5" },
          ].map((stat) => (
            <div
              key={stat.label}
              style={{
                backgroundColor: "#FFFFFF",
                border: "1px solid #efefef",
                borderRadius: "2px",
                padding: "1.5rem 1.75rem",
                borderTop: "2px solid #F4A0B5",
              }}
            >
              <p
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: "0.58rem",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "#bbb",
                  fontWeight: 400,
                  marginBottom: "0.5rem",
                }}
              >
                {stat.label}
              </p>
              <p
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontWeight: 400,
                  fontSize: "2.25rem",
                  color: stat.color,
                  lineHeight: 1,
                }}
              >
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Bookings table */}
        <div
          style={{
            backgroundColor: "#FFFFFF",
            border: "1px solid #efefef",
            borderRadius: "2px",
            overflow: "hidden",
          }}
        >
          {/* Table header row */}
          <div
            style={{
              padding: "1.25rem 1.75rem",
              borderBottom: "1px solid #f5f5f5",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <h2
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontWeight: 400,
                fontSize: "1.25rem",
                color: "#0A0A0A",
                letterSpacing: "0.03em",
              }}
            >
              All Bookings
            </h2>
            <span
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontSize: "0.65rem",
                color: "#bbb",
                fontWeight: 300,
                letterSpacing: "0.06em",
              }}
            >
              {bookings.length} {bookings.length === 1 ? "record" : "records"}
            </span>
          </div>

          {bookings.length === 0 ? (
            <div style={{ padding: "4rem", textAlign: "center" }}>
              <p
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontWeight: 300,
                  fontSize: "0.82rem",
                  color: "#ccc",
                  letterSpacing: "0.04em",
                }}
              >
                No bookings yet.
              </p>
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8rem" }}>
                <thead>
                  <tr style={{ backgroundColor: "#FDF0F4" }}>
                    {["Client", "Service", "Date & Time", "Price", "Status", "Booked At"].map((h) => (
                      <th
                        key={h}
                        style={{
                          textAlign: "left",
                          padding: "0.75rem 1.25rem",
                          fontFamily: "'Montserrat', sans-serif",
                          fontSize: "0.58rem",
                          letterSpacing: "0.12em",
                          textTransform: "uppercase",
                          color: "#aaa",
                          fontWeight: 400,
                          borderBottom: "1px solid #f0f0f0",
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr
                      key={booking.id}
                      style={{ borderBottom: "1px solid #fafafa", transition: "background-color 0.15s ease" }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLTableRowElement).style.backgroundColor = "#FDF0F4";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLTableRowElement).style.backgroundColor = "transparent";
                      }}
                    >
                      <td style={{ padding: "1rem 1.25rem" }}>
                        <p
                          style={{
                            fontFamily: "'Montserrat', sans-serif",
                            fontWeight: 500,
                            fontSize: "0.8rem",
                            color: "#0A0A0A",
                          }}
                        >
                          {booking.client_name}
                        </p>
                        <p
                          style={{
                            fontFamily: "'Montserrat', sans-serif",
                            fontWeight: 300,
                            fontSize: "0.68rem",
                            color: "#aaa",
                            marginTop: "0.15rem",
                          }}
                        >
                          {booking.client_email}
                        </p>
                        <p
                          style={{
                            fontFamily: "'Montserrat', sans-serif",
                            fontWeight: 300,
                            fontSize: "0.68rem",
                            color: "#aaa",
                          }}
                        >
                          {booking.client_phone}
                        </p>
                      </td>
                      <td
                        style={{
                          padding: "1rem 1.25rem",
                          fontFamily: "'Cormorant Garamond', Georgia, serif",
                          fontSize: "0.95rem",
                          color: "#333",
                          fontWeight: 400,
                        }}
                      >
                        {booking.service_name}
                      </td>
                      <td style={{ padding: "1rem 1.25rem" }}>
                        <p
                          style={{
                            fontFamily: "'Montserrat', sans-serif",
                            fontSize: "0.75rem",
                            color: "#0A0A0A",
                            fontWeight: 400,
                          }}
                        >
                          {booking.appointment_date}
                        </p>
                        <p
                          style={{
                            fontFamily: "'Montserrat', sans-serif",
                            fontSize: "0.68rem",
                            color: "#aaa",
                            fontWeight: 300,
                            marginTop: "0.15rem",
                          }}
                        >
                          {formatTime(booking.appointment_time)}
                        </p>
                      </td>
                      <td
                        style={{
                          padding: "1rem 1.25rem",
                          fontFamily: "'Montserrat', sans-serif",
                          fontSize: "0.8rem",
                          fontWeight: 500,
                          color: "#F4A0B5",
                        }}
                      >
                        ${booking.service_price}
                      </td>
                      <td style={{ padding: "1rem 1.25rem" }}>
                        <span
                          style={{
                            display: "inline-block",
                            padding: "0.25rem 0.75rem",
                            fontFamily: "'Montserrat', sans-serif",
                            fontSize: "0.58rem",
                            letterSpacing: "0.1em",
                            textTransform: "uppercase",
                            fontWeight: 500,
                            borderRadius: "999px",
                            backgroundColor:
                              booking.status === "confirmed" ? "#0A0A0A" : "#FDF0F4",
                            color:
                              booking.status === "confirmed" ? "#FFFFFF" : "#F4A0B5",
                            border:
                              booking.status === "confirmed"
                                ? "1px solid #0A0A0A"
                                : "1px solid #F4A0B5",
                          }}
                        >
                          {booking.status}
                        </span>
                      </td>
                      <td
                        style={{
                          padding: "1rem 1.25rem",
                          fontFamily: "'Montserrat', sans-serif",
                          fontSize: "0.68rem",
                          color: "#bbb",
                          fontWeight: 300,
                        }}
                      >
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
