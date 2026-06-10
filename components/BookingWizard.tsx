"use client";

import { useState, useEffect } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Service {
  name: string;
  price: number;
  duration: number;
  description: string;
}

interface BookingState {
  service: Service | null;
  date: string;
  time: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const SERVICES: Service[] = [
  {
    name: "Classic Full Set",
    price: 120,
    duration: 120,
    description: "A complete classic lash set for natural-looking volume and length.",
  },
  {
    name: "Classic Fill",
    price: 65,
    duration: 60,
    description: "Maintain your classic set with a professional fill appointment.",
  },
  {
    name: "Volume Full Set",
    price: 160,
    duration: 150,
    description: "Handcrafted fans for dramatic, full-volume lash glamour.",
  },
  {
    name: "Volume Fill",
    price: 80,
    duration: 75,
    description: "Keep your volume lashes looking flawless with a fill.",
  },
  {
    name: "Lash Removal",
    price: 30,
    duration: 30,
    description: "Safe and gentle removal of lash extensions.",
  },
];

const TIME_SLOTS = [
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
];

function formatTime(timeStr: string): string {
  const [hourStr] = timeStr.split(":");
  const hour = parseInt(hourStr, 10);
  const suffix = hour >= 12 ? "PM" : "AM";
  const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
  return `${displayHour}:00 ${suffix}`;
}

function getNext30Days(): Date[] {
  const days: Date[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  for (let i = 1; days.length < 30; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    if (d.getDay() !== 0) {
      days.push(d);
    }
  }
  return days;
}

function formatDateLabel(date: Date): { day: string; num: string; month: string } {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  return {
    day: days[date.getDay()],
    num: String(date.getDate()),
    month: months[date.getMonth()],
  };
}

function toDateString(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function formatFullDate(dateStr: string): string {
  if (!dateStr) return "";
  const [year, month, day] = dateStr.split("-").map(Number);
  const d = new Date(year, month - 1, day);
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// ─── Step Indicator ──────────────────────────────────────────────────────────

function StepIndicator({ current }: { current: number }) {
  const steps = ["Service", "Date & Time", "Your Info", "Review"];
  return (
    <div className="flex items-center justify-center mb-10">
      {steps.map((label, i) => {
        const num = i + 1;
        const isActive = num === current;
        const isDone = num < current;
        return (
          <div key={i} className="flex items-center">
            <div className="flex flex-col items-center gap-1.5">
              <div
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.65rem",
                  fontFamily: "'Montserrat', sans-serif",
                  fontWeight: 500,
                  letterSpacing: "0.05em",
                  transition: "all 0.3s ease",
                  backgroundColor: isActive
                    ? "#0A0A0A"
                    : isDone
                    ? "#F4A0B5"
                    : "transparent",
                  color: isActive ? "#FFFFFF" : isDone ? "#FFFFFF" : "#bbb",
                  border: isActive
                    ? "1px solid #0A0A0A"
                    : isDone
                    ? "1px solid #F4A0B5"
                    : "1px solid #ddd",
                }}
              >
                {isDone ? (
                  <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  num
                )}
              </div>
              <span
                style={{
                  fontSize: "0.6rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  fontFamily: "'Montserrat', sans-serif",
                  fontWeight: 400,
                  color: isActive ? "#0A0A0A" : isDone ? "#F4A0B5" : "#ccc",
                  display: "none",
                }}
                className="sm:block"
              >
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                style={{
                  height: "1px",
                  width: "48px",
                  marginBottom: "18px",
                  marginLeft: "6px",
                  marginRight: "6px",
                  backgroundColor: num < current ? "#F4A0B5" : "#e8e8e8",
                  transition: "background-color 0.3s ease",
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Step Heading ─────────────────────────────────────────────────────────────

function StepHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-center mb-8">
      <h3
        style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontStyle: "italic",
          fontWeight: 300,
          fontSize: "1.75rem",
          color: "#0A0A0A",
          letterSpacing: "0.03em",
          marginBottom: "0.75rem",
        }}
      >
        {children}
      </h3>
      <div
        style={{
          width: "32px",
          height: "1px",
          backgroundColor: "#F4A0B5",
          margin: "0 auto",
        }}
      />
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function BookingWizard() {
  const [step, setStep] = useState(1);
  const [booking, setBooking] = useState<BookingState>({
    service: null,
    date: "",
    time: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [loadingCheckout, setLoadingCheckout] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const availableDays = getNext30Days();

  useEffect(() => {
    if (!booking.date) return;
    setLoadingSlots(true);
    setBookedSlots([]);
    fetch(`/api/bookings/slots?date=${booking.date}`)
      .then((r) => r.json())
      .then((data) => {
        setBookedSlots(data.bookedSlots ?? []);
      })
      .catch(() => {})
      .finally(() => setLoadingSlots(false));
  }, [booking.date]);

  // ── Step 1: Service Selection ─────────────────────────────────────────────

  const renderStep1 = () => (
    <div>
      <StepHeading>Choose Your Service</StepHeading>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {SERVICES.map((service) => {
          const isSelected = booking.service?.name === service.name;
          return (
            <button
              key={service.name}
              onClick={() => setBooking((b) => ({ ...b, service }))}
              style={{
                textAlign: "left",
                padding: "1.25rem 1.5rem",
                border: isSelected ? "1px solid #0A0A0A" : "1px solid #0A0A0A",
                backgroundColor: isSelected ? "#0A0A0A" : "#FFFFFF",
                color: isSelected ? "#FFFFFF" : "#0A0A0A",
                borderRadius: "2px",
                cursor: "pointer",
                transition: "all 0.25s ease",
              }}
              onMouseEnter={(e) => {
                if (!isSelected) {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#0A0A0A";
                  (e.currentTarget as HTMLButtonElement).style.color = "#FFFFFF";
                }
              }}
              onMouseLeave={(e) => {
                if (!isSelected) {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#FFFFFF";
                  (e.currentTarget as HTMLButtonElement).style.color = "#0A0A0A";
                }
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: "0.5rem",
                }}
              >
                <span
                  style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontWeight: 400,
                    fontSize: "1.05rem",
                    letterSpacing: "0.02em",
                    flex: 1,
                    paddingRight: "0.75rem",
                  }}
                >
                  {service.name}
                </span>
                <span
                  style={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontWeight: 500,
                    fontSize: "0.95rem",
                    color: isSelected ? "#F4A0B5" : "#F4A0B5",
                    whiteSpace: "nowrap",
                  }}
                >
                  ${service.price}
                </span>
              </div>
              <p
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontWeight: 300,
                  fontSize: "0.72rem",
                  lineHeight: 1.6,
                  opacity: isSelected ? 0.75 : 0.55,
                  marginBottom: "0.75rem",
                }}
              >
                {service.description}
              </p>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.3rem",
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: "0.65rem",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  opacity: 0.5,
                }}
              >
                <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {service.duration} min
              </div>
            </button>
          );
        })}
      </div>

      <div style={{ marginTop: "2.5rem", display: "flex", justifyContent: "flex-end" }}>
        <button
          onClick={() => { if (!booking.service) return; setStep(2); }}
          disabled={!booking.service}
          className="btn-elegant"
          style={{ opacity: booking.service ? 1 : 0.35 }}
        >
          Continue
        </button>
      </div>
    </div>
  );

  // ── Step 2: Date & Time ───────────────────────────────────────────────────

  const renderStep2 = () => (
    <div>
      <StepHeading>Select Date &amp; Time</StepHeading>

      {/* Date strip */}
      <div style={{ marginBottom: "2rem" }}>
        <p
          style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: "0.6rem",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "#aaa",
            fontWeight: 400,
            marginBottom: "0.75rem",
          }}
        >
          Available Dates
        </p>
        <div
          className="scrollbar-hide"
          style={{ display: "flex", gap: "0.5rem", overflowX: "auto", paddingBottom: "0.5rem" }}
        >
          {availableDays.map((d) => {
            const ds = toDateString(d);
            const isSelected = booking.date === ds;
            const label = formatDateLabel(d);
            return (
              <button
                key={ds}
                onClick={() => setBooking((b) => ({ ...b, date: ds, time: "" }))}
                style={{
                  flexShrink: 0,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  width: "52px",
                  padding: "0.75rem 0",
                  border: isSelected ? "1px solid #0A0A0A" : "1px solid #e0e0e0",
                  backgroundColor: isSelected ? "#0A0A0A" : "#FFFFFF",
                  color: isSelected ? "#FFFFFF" : "#555",
                  borderRadius: "2px",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                <span
                  style={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontSize: "0.6rem",
                    fontWeight: 400,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    opacity: 0.7,
                  }}
                >
                  {label.day}
                </span>
                <span
                  style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontSize: "1.35rem",
                    fontWeight: 400,
                    lineHeight: 1.1,
                    margin: "0.2rem 0",
                  }}
                >
                  {label.num}
                </span>
                <span
                  style={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontSize: "0.6rem",
                    fontWeight: 300,
                    opacity: 0.6,
                  }}
                >
                  {label.month}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Time slots */}
      {booking.date && (
        <div>
          <p
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: "0.6rem",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "#aaa",
              fontWeight: 400,
              marginBottom: "0.75rem",
            }}
          >
            Available Times — {formatFullDate(booking.date)}
          </p>
          {loadingSlots ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                color: "#ccc",
                fontFamily: "'Montserrat', sans-serif",
                fontSize: "0.8rem",
                padding: "1.5rem 0",
              }}
            >
              <svg className="animate-spin" width="16" height="16" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Loading available times...
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: "0.5rem",
              }}
            >
              {TIME_SLOTS.map((slot) => {
                const isBooked = bookedSlots.includes(slot);
                const isSelected = booking.time === slot;
                return (
                  <button
                    key={slot}
                    disabled={isBooked}
                    onClick={() => setBooking((b) => ({ ...b, time: slot }))}
                    style={{
                      padding: "0.6rem 0",
                      borderRadius: "999px",
                      fontFamily: "'Montserrat', sans-serif",
                      fontSize: "0.72rem",
                      fontWeight: 400,
                      letterSpacing: "0.05em",
                      border: isBooked
                        ? "1px solid #f0f0f0"
                        : isSelected
                        ? "1px solid #0A0A0A"
                        : "1px solid #ddd",
                      backgroundColor: isBooked
                        ? "#fafafa"
                        : isSelected
                        ? "#0A0A0A"
                        : "#FFFFFF",
                      color: isBooked ? "#ccc" : isSelected ? "#FFFFFF" : "#555",
                      cursor: isBooked ? "not-allowed" : "pointer",
                      transition: "all 0.2s ease",
                    }}
                  >
                    {formatTime(slot)}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {!booking.date && (
        <p
          style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: "0.8rem",
            fontWeight: 300,
            color: "#bbb",
            textAlign: "center",
            padding: "2rem 0",
            letterSpacing: "0.04em",
          }}
        >
          Select a date above to see available times
        </p>
      )}

      <div
        style={{
          marginTop: "2.5rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <button onClick={() => setStep(1)} className="btn-outline">
          Back
        </button>
        <button
          onClick={() => { if (!booking.date || !booking.time) return; setStep(3); }}
          disabled={!booking.date || !booking.time}
          className="btn-elegant"
          style={{ opacity: booking.date && booking.time ? 1 : 0.35 }}
        >
          Continue
        </button>
      </div>
    </div>
  );

  // ── Step 3: Contact Info ──────────────────────────────────────────────────

  const validateStep3 = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!booking.firstName.trim()) newErrors.firstName = "First name is required";
    if (!booking.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!booking.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(booking.email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (!booking.phone.trim()) newErrors.phone = "Phone number is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontFamily: "'Montserrat', sans-serif",
    fontSize: "0.6rem",
    letterSpacing: "0.15em",
    textTransform: "uppercase",
    color: "#888",
    fontWeight: 400,
    marginBottom: "0.4rem",
  };

  const renderStep3 = () => (
    <div>
      <StepHeading>Your Information</StepHeading>

      <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
          <div>
            <label style={labelStyle}>First Name *</label>
            <input
              type="text"
              value={booking.firstName}
              onChange={(e) => setBooking((b) => ({ ...b, firstName: e.target.value }))}
              className="input-field"
              placeholder="Jane"
              style={{ borderBottomColor: errors.firstName ? "#f87171" : undefined }}
            />
            {errors.firstName && (
              <p style={{ color: "#f87171", fontSize: "0.7rem", marginTop: "0.3rem", fontFamily: "'Montserrat', sans-serif" }}>
                {errors.firstName}
              </p>
            )}
          </div>
          <div>
            <label style={labelStyle}>Last Name *</label>
            <input
              type="text"
              value={booking.lastName}
              onChange={(e) => setBooking((b) => ({ ...b, lastName: e.target.value }))}
              className="input-field"
              placeholder="Smith"
              style={{ borderBottomColor: errors.lastName ? "#f87171" : undefined }}
            />
            {errors.lastName && (
              <p style={{ color: "#f87171", fontSize: "0.7rem", marginTop: "0.3rem", fontFamily: "'Montserrat', sans-serif" }}>
                {errors.lastName}
              </p>
            )}
          </div>
        </div>

        <div>
          <label style={labelStyle}>Email Address *</label>
          <input
            type="email"
            value={booking.email}
            onChange={(e) => setBooking((b) => ({ ...b, email: e.target.value }))}
            className="input-field"
            placeholder="jane@example.com"
            style={{ borderBottomColor: errors.email ? "#f87171" : undefined }}
          />
          {errors.email && (
            <p style={{ color: "#f87171", fontSize: "0.7rem", marginTop: "0.3rem", fontFamily: "'Montserrat', sans-serif" }}>
              {errors.email}
            </p>
          )}
        </div>

        <div>
          <label style={labelStyle}>Phone Number *</label>
          <input
            type="tel"
            value={booking.phone}
            onChange={(e) => setBooking((b) => ({ ...b, phone: e.target.value }))}
            className="input-field"
            placeholder="+1 (555) 000-0000"
            style={{ borderBottomColor: errors.phone ? "#f87171" : undefined }}
          />
          {errors.phone && (
            <p style={{ color: "#f87171", fontSize: "0.7rem", marginTop: "0.3rem", fontFamily: "'Montserrat', sans-serif" }}>
              {errors.phone}
            </p>
          )}
        </div>
      </div>

      <div
        style={{
          marginTop: "2.5rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <button onClick={() => setStep(2)} className="btn-outline">
          Back
        </button>
        <button
          onClick={() => { if (validateStep3()) setStep(4); }}
          className="btn-elegant"
        >
          Review Booking
        </button>
      </div>
    </div>
  );

  // ── Step 4: Review & Pay ──────────────────────────────────────────────────

  const handlePay = async () => {
    if (!booking.service) return;
    setLoadingCheckout(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceName: booking.service.name,
          servicePrice: booking.service.price,
          appointmentDate: booking.date,
          appointmentTime: booking.time,
          clientName: `${booking.firstName} ${booking.lastName}`,
          clientEmail: booking.email,
          clientPhone: booking.phone,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) {
        alert("Failed to create checkout session. Please try again.");
        setLoadingCheckout(false);
        return;
      }
      window.location.href = data.url;
    } catch {
      alert("Something went wrong. Please try again.");
      setLoadingCheckout(false);
    }
  };

  const renderStep4 = () => {
    if (!booking.service) return null;
    return (
      <div>
        <StepHeading>Review &amp; Confirm</StepHeading>

        {/* Summary card */}
        <div
          style={{
            border: "1px solid #e8e8e8",
            backgroundColor: "#FFFFFF",
            borderRadius: "2px",
            overflow: "hidden",
            marginBottom: "1.5rem",
          }}
        >
          {/* Blush top accent */}
          <div style={{ height: "2px", backgroundColor: "#F4A0B5" }} />

          <div style={{ padding: "1.75rem 2rem" }}>
            {/* Service + price */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-end",
                paddingBottom: "1.25rem",
                borderBottom: "1px solid #f0f0f0",
                marginBottom: "1.25rem",
              }}
            >
              <div>
                <p
                  style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontWeight: 400,
                    fontSize: "1.3rem",
                    color: "#0A0A0A",
                    letterSpacing: "0.02em",
                  }}
                >
                  {booking.service.name}
                </p>
                <p
                  style={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontSize: "0.68rem",
                    fontWeight: 300,
                    color: "#aaa",
                    marginTop: "0.2rem",
                    letterSpacing: "0.05em",
                  }}
                >
                  {booking.service.duration} minutes
                </p>
              </div>
              <span
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontWeight: 600,
                  fontSize: "1.5rem",
                  color: "#F4A0B5",
                  letterSpacing: "0.02em",
                }}
              >
                ${booking.service.price}
              </span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
              <ReviewRow label="Date" value={formatFullDate(booking.date)} />
              <ReviewRow label="Time" value={formatTime(booking.time)} />
              <div
                style={{
                  height: "1px",
                  backgroundColor: "#f0f0f0",
                  margin: "0.25rem 0",
                }}
              />
              <ReviewRow label="Name" value={`${booking.firstName} ${booking.lastName}`} />
              <ReviewRow label="Email" value={booking.email} />
              <ReviewRow label="Phone" value={booking.phone} />
            </div>
          </div>
        </div>

        {/* Stripe note */}
        <p
          style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: "0.7rem",
            fontWeight: 300,
            color: "#bbb",
            textAlign: "center",
            letterSpacing: "0.04em",
            marginBottom: "2rem",
          }}
        >
          You will be redirected to Stripe&apos;s secure checkout. Booking is confirmed upon payment.
        </p>

        {/* Pay button — full width, black */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <button
            onClick={handlePay}
            disabled={loadingCheckout}
            style={{
              width: "100%",
              padding: "1rem",
              backgroundColor: loadingCheckout ? "#555" : "#0A0A0A",
              color: "#FFFFFF",
              border: "none",
              borderRadius: "2px",
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: 500,
              fontSize: "0.7rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              cursor: loadingCheckout ? "not-allowed" : "pointer",
              transition: "all 0.25s ease",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.75rem",
              boxShadow: "3px 3px 0px #F4A0B5",
            }}
            onMouseEnter={(e) => {
              if (!loadingCheckout) {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#F4A0B5";
                (e.currentTarget as HTMLButtonElement).style.color = "#0A0A0A";
                (e.currentTarget as HTMLButtonElement).style.boxShadow = "3px 3px 0px #0A0A0A";
              }
            }}
            onMouseLeave={(e) => {
              if (!loadingCheckout) {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#0A0A0A";
                (e.currentTarget as HTMLButtonElement).style.color = "#FFFFFF";
                (e.currentTarget as HTMLButtonElement).style.boxShadow = "3px 3px 0px #F4A0B5";
              }
            }}
          >
            {loadingCheckout ? (
              <>
                <svg className="animate-spin" width="16" height="16" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Redirecting to Checkout...
              </>
            ) : (
              <>
                <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Pay Now — ${booking.service.price}
              </>
            )}
          </button>

          <div style={{ display: "flex", justifyContent: "flex-start" }}>
            <button onClick={() => setStep(3)} className="btn-outline">
              Back
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      style={{
        backgroundColor: "#FFFFFF",
        border: "1px solid #efefef",
        borderRadius: "2px",
        padding: "2.5rem 2rem",
        boxShadow: "0 2px 40px rgba(0,0,0,0.04)",
      }}
    >
      <StepIndicator current={step} />
      {step === 1 && renderStep1()}
      {step === 2 && renderStep2()}
      {step === 3 && renderStep3()}
      {step === 4 && renderStep4()}
    </div>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
      <span
        style={{
          fontFamily: "'Montserrat', sans-serif",
          fontSize: "0.6rem",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "#aaa",
          fontWeight: 400,
          paddingTop: "0.1rem",
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontFamily: "'Montserrat', sans-serif",
          fontSize: "0.8rem",
          fontWeight: 400,
          color: "#0A0A0A",
          textAlign: "right",
          marginLeft: "1rem",
          maxWidth: "65%",
        }}
      >
        {value}
      </span>
    </div>
  );
}
