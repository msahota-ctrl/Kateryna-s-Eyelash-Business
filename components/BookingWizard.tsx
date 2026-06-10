"use client";

import { useState, useEffect } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Service {
  name: string;
  price: number;
  duration: number; // minutes
  description: string;
}

interface BookingState {
  service: Service | null;
  date: string; // YYYY-MM-DD
  time: string; // HH:00
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
      // Skip Sundays
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

function StepIndicator({ step, current }: { step: number; current: number }) {
  const steps = ["Service", "Date & Time", "Your Info", "Review"];
  return (
    <div className="flex items-center justify-center gap-1 mb-8">
      {steps.map((label, i) => {
        const num = i + 1;
        const isActive = num === current;
        const isDone = num < current;
        return (
          <div key={i} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`step-indicator ${
                  isActive
                    ? "bg-rose-gold text-white shadow-soft"
                    : isDone
                    ? "bg-rose-gold/20 text-rose-gold"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                {isDone ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  num
                )}
              </div>
              <span
                className={`text-xs mt-1 hidden sm:block ${
                  isActive ? "text-rose-gold font-medium" : "text-gray-400"
                }`}
              >
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={`h-px w-8 sm:w-16 mx-1 mb-4 transition-colors ${
                  num < current ? "bg-rose-gold/40" : "bg-gray-200"
                }`}
              />
            )}
          </div>
        );
      })}
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

  // Fetch booked slots when date changes
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
      <h3 className="font-serif text-xl text-gray-800 mb-6 text-center">
        Choose Your Service
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {SERVICES.map((service) => {
          const isSelected = booking.service?.name === service.name;
          return (
            <button
              key={service.name}
              onClick={() => {
                setBooking((b) => ({ ...b, service }));
              }}
              className={`text-left p-5 rounded-2xl border-2 transition-all duration-200 hover:shadow-soft-md ${
                isSelected
                  ? "border-rose-gold bg-rose-gold/5 shadow-soft"
                  : "border-gray-100 bg-white hover:border-rose-gold/40"
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-serif text-base text-gray-800 leading-snug pr-2">
                  {service.name}
                </h4>
                <span className="text-rose-gold font-semibold text-base whitespace-nowrap">
                  ${service.price}
                </span>
              </div>
              <p className="text-gray-500 text-xs leading-relaxed mb-3">
                {service.description}
              </p>
              <div className="flex items-center gap-1 text-gray-400 text-xs">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {service.duration} min
              </div>
              {isSelected && (
                <div className="mt-3 flex items-center gap-1.5 text-rose-gold text-xs font-medium">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Selected
                </div>
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-8 flex justify-end">
        <button
          onClick={() => {
            if (!booking.service) return;
            setStep(2);
          }}
          disabled={!booking.service}
          className="btn-primary"
        >
          Continue →
        </button>
      </div>
    </div>
  );

  // ── Step 2: Date & Time ───────────────────────────────────────────────────

  const renderStep2 = () => (
    <div>
      <h3 className="font-serif text-xl text-gray-800 mb-6 text-center">
        Pick a Date & Time
      </h3>

      {/* Date grid */}
      <div className="mb-6">
        <p className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-3">
          Available Dates
        </p>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {availableDays.map((d) => {
            const ds = toDateString(d);
            const isSelected = booking.date === ds;
            const label = formatDateLabel(d);
            return (
              <button
                key={ds}
                onClick={() => {
                  setBooking((b) => ({ ...b, date: ds, time: "" }));
                }}
                className={`flex-shrink-0 flex flex-col items-center w-14 py-3 rounded-xl border-2 transition-all duration-200 ${
                  isSelected
                    ? "border-rose-gold bg-rose-gold text-white shadow-soft"
                    : "border-gray-100 bg-white hover:border-rose-gold/40 text-gray-600"
                }`}
              >
                <span className="text-xs font-medium uppercase">{label.day}</span>
                <span className="text-lg font-serif font-semibold leading-tight">{label.num}</span>
                <span className="text-xs opacity-70">{label.month}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Time slots */}
      {booking.date && (
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-3">
            Available Times — {formatFullDate(booking.date)}
          </p>
          {loadingSlots ? (
            <div className="flex items-center gap-2 text-gray-400 text-sm py-4">
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Loading available times...
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-2">
              {TIME_SLOTS.map((slot) => {
                const isBooked = bookedSlots.includes(slot);
                const isSelected = booking.time === slot;
                return (
                  <button
                    key={slot}
                    disabled={isBooked}
                    onClick={() => setBooking((b) => ({ ...b, time: slot }))}
                    className={`py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isBooked
                        ? "bg-gray-50 text-gray-300 cursor-not-allowed"
                        : isSelected
                        ? "bg-rose-gold text-white shadow-soft"
                        : "bg-white border border-gray-200 text-gray-700 hover:border-rose-gold/50 hover:text-rose-gold"
                    }`}
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
        <p className="text-gray-400 text-sm text-center py-4">
          Select a date to see available times
        </p>
      )}

      <div className="mt-8 flex justify-between">
        <button onClick={() => setStep(1)} className="btn-outline">
          ← Back
        </button>
        <button
          onClick={() => {
            if (!booking.date || !booking.time) return;
            setStep(3);
          }}
          disabled={!booking.date || !booking.time}
          className="btn-primary"
        >
          Continue →
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

  const renderStep3 = () => (
    <div>
      <h3 className="font-serif text-xl text-gray-800 mb-6 text-center">
        Your Information
      </h3>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-500 uppercase tracking-wide font-medium mb-1.5">
              First Name *
            </label>
            <input
              type="text"
              value={booking.firstName}
              onChange={(e) => setBooking((b) => ({ ...b, firstName: e.target.value }))}
              className={`input-field ${errors.firstName ? "border-red-300 ring-red-200" : ""}`}
              placeholder="Jane"
            />
            {errors.firstName && (
              <p className="text-red-400 text-xs mt-1">{errors.firstName}</p>
            )}
          </div>
          <div>
            <label className="block text-xs text-gray-500 uppercase tracking-wide font-medium mb-1.5">
              Last Name *
            </label>
            <input
              type="text"
              value={booking.lastName}
              onChange={(e) => setBooking((b) => ({ ...b, lastName: e.target.value }))}
              className={`input-field ${errors.lastName ? "border-red-300 ring-red-200" : ""}`}
              placeholder="Smith"
            />
            {errors.lastName && (
              <p className="text-red-400 text-xs mt-1">{errors.lastName}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-xs text-gray-500 uppercase tracking-wide font-medium mb-1.5">
            Email Address *
          </label>
          <input
            type="email"
            value={booking.email}
            onChange={(e) => setBooking((b) => ({ ...b, email: e.target.value }))}
            className={`input-field ${errors.email ? "border-red-300 ring-red-200" : ""}`}
            placeholder="jane@example.com"
          />
          {errors.email && (
            <p className="text-red-400 text-xs mt-1">{errors.email}</p>
          )}
        </div>

        <div>
          <label className="block text-xs text-gray-500 uppercase tracking-wide font-medium mb-1.5">
            Phone Number *
          </label>
          <input
            type="tel"
            value={booking.phone}
            onChange={(e) => setBooking((b) => ({ ...b, phone: e.target.value }))}
            className={`input-field ${errors.phone ? "border-red-300 ring-red-200" : ""}`}
            placeholder="+1 (555) 000-0000"
          />
          {errors.phone && (
            <p className="text-red-400 text-xs mt-1">{errors.phone}</p>
          )}
        </div>
      </div>

      <div className="mt-8 flex justify-between">
        <button onClick={() => setStep(2)} className="btn-outline">
          ← Back
        </button>
        <button
          onClick={() => {
            if (validateStep3()) setStep(4);
          }}
          className="btn-primary"
        >
          Review Booking →
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
        <h3 className="font-serif text-xl text-gray-800 mb-6 text-center">
          Review Your Booking
        </h3>

        <div className="bg-rose-gold-bg rounded-2xl p-6 mb-6 border border-rose-gold/10">
          {/* Decorative accent */}
          <div className="h-1 bg-gradient-to-r from-rose-gold-light via-rose-gold to-rose-gold-dark rounded-full mb-5" />

          <div className="space-y-4">
            <ReviewRow label="Service" value={booking.service.name} />
            <ReviewRow label="Price" value={`$${booking.service.price}`} highlight />
            <ReviewRow label="Duration" value={`${booking.service.duration} minutes`} />
            <div className="border-t border-rose-gold/10 pt-4">
              <ReviewRow label="Date" value={formatFullDate(booking.date)} />
              <ReviewRow label="Time" value={formatTime(booking.time)} />
            </div>
            <div className="border-t border-rose-gold/10 pt-4">
              <ReviewRow
                label="Name"
                value={`${booking.firstName} ${booking.lastName}`}
              />
              <ReviewRow label="Email" value={booking.email} />
              <ReviewRow label="Phone" value={booking.phone} />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-xl p-4 mb-6">
          <p className="text-xs text-gray-500 text-center">
            You will be redirected to Stripe&apos;s secure payment page. Your booking is
            confirmed upon successful payment.
          </p>
        </div>

        <div className="flex justify-between">
          <button onClick={() => setStep(3)} className="btn-outline">
            ← Back
          </button>
          <button
            onClick={handlePay}
            disabled={loadingCheckout}
            className="btn-primary flex items-center gap-2 px-8"
          >
            {loadingCheckout ? (
              <>
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Redirecting...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Pay Now — ${booking.service.price}
              </>
            )}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-soft-md border border-rose-gold/10 p-6 md:p-8">
      <StepIndicator step={step} current={step} />
      {step === 1 && renderStep1()}
      {step === 2 && renderStep2()}
      {step === 3 && renderStep3()}
      {step === 4 && renderStep4()}
    </div>
  );
}

function ReviewRow({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex justify-between items-start py-1.5">
      <span className="text-xs text-gray-400 uppercase tracking-wide font-medium">
        {label}
      </span>
      <span
        className={`text-sm font-medium text-right ml-4 ${
          highlight ? "text-rose-gold text-base" : "text-gray-800"
        }`}
      >
        {value}
      </span>
    </div>
  );
}
