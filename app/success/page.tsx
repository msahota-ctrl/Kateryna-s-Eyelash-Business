import Link from "next/link";
import Stripe from "stripe";

interface SearchParams {
  session_id?: string;
}

interface BookingDetails {
  service: string;
  price: string;
  date: string;
  time: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
}

async function getBookingDetails(sessionId: string): Promise<BookingDetails | null> {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2024-06-20",
    });
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const meta = session.metadata;
    if (!meta) return null;
    return {
      service: meta.service_name ?? "",
      price: meta.service_price ?? "",
      date: meta.appointment_date ?? "",
      time: meta.appointment_time ?? "",
      clientName: meta.client_name ?? "",
      clientEmail: meta.client_email ?? (session.customer_details?.email ?? ""),
      clientPhone: meta.client_phone ?? "",
    };
  } catch {
    return null;
  }
}

function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  const [year, month, day] = dateStr.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatTime(timeStr: string): string {
  if (!timeStr) return "";
  const [hourStr] = timeStr.split(":");
  const hour = parseInt(hourStr, 10);
  const suffix = hour >= 12 ? "PM" : "AM";
  const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
  return `${displayHour}:00 ${suffix}`;
}

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sessionId = searchParams.session_id;

  if (!sessionId) {
    return (
      <main
        style={{
          minHeight: "100vh",
          backgroundColor: "#FDF0F4",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "1rem",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <h1
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontWeight: 300,
              fontSize: "2rem",
              color: "#0A0A0A",
              marginBottom: "1rem",
            }}
          >
            Invalid Link
          </h1>
          <p
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: 300,
              fontSize: "0.85rem",
              color: "#aaa",
              marginBottom: "1.5rem",
            }}
          >
            No booking session found.
          </p>
          <Link href="/" className="btn-elegant">
            Book an Appointment
          </Link>
        </div>
      </main>
    );
  }

  const booking = await getBookingDetails(sessionId);

  return (
    <main style={{ minHeight: "100vh", backgroundColor: "#FDF0F4" }}>
      {/* Black hero section with jungle bg */}
      <div
        className="jungle-bg"
        style={{
          backgroundColor: "#0A0A0A",
          padding: "4rem 1rem 5rem",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Blush circle checkmark */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: "64px",
            height: "64px",
            border: "1px solid #F4A0B5",
            borderRadius: "50%",
            marginBottom: "1.75rem",
          }}
        >
          <svg
            width="28"
            height="28"
            fill="none"
            stroke="#F4A0B5"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        <p
          style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: "0.6rem",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "#F4A0B5",
            fontWeight: 400,
            marginBottom: "0.75rem",
          }}
        >
          Booking Confirmed
        </p>
        <h1
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontWeight: 300,
            fontSize: "clamp(2rem, 5vw, 3.25rem)",
            color: "#FFFFFF",
            letterSpacing: "0.06em",
            marginBottom: "0.75rem",
          }}
        >
          Kateryna&apos;s Laser &amp; Lash Salon
        </h1>
        <div
          style={{
            width: "40px",
            height: "1px",
            backgroundColor: "#F4A0B5",
            margin: "0 auto 1rem",
          }}
        />
        <p
          style={{
            fontFamily: "'Montserrat', sans-serif",
            fontWeight: 300,
            fontSize: "0.8rem",
            color: "rgba(255,255,255,0.55)",
            letterSpacing: "0.08em",
          }}
        >
          We can&apos;t wait to see you.
        </p>
      </div>

      {/* White card */}
      <div
        style={{
          maxWidth: "560px",
          margin: "-2.5rem auto 0",
          padding: "0 1rem 4rem",
        }}
      >
        {booking ? (
          <div
            style={{
              backgroundColor: "#FFFFFF",
              border: "1px solid #efefef",
              borderRadius: "2px",
              overflow: "hidden",
              boxShadow: "0 4px 40px rgba(0,0,0,0.06)",
            }}
          >
            {/* Blush accent top bar */}
            <div style={{ height: "2px", backgroundColor: "#F4A0B5" }} />

            <div style={{ padding: "2rem 2.25rem" }}>
              <h2
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontWeight: 400,
                  fontSize: "1.35rem",
                  color: "#0A0A0A",
                  letterSpacing: "0.03em",
                  marginBottom: "1.5rem",
                }}
              >
                Appointment Details
              </h2>

              <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
                <DetailRow
                  icon={
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                    </svg>
                  }
                  label="Service"
                  value={booking.service}
                />
                <DetailRow
                  icon={
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  }
                  label="Amount Paid"
                  value={`$${booking.price}`}
                  highlight
                />
                <DetailRow
                  icon={
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                    </svg>
                  }
                  label="Date"
                  value={formatDate(booking.date)}
                />
                <DetailRow
                  icon={
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  }
                  label="Time"
                  value={formatTime(booking.time)}
                />

                <div
                  style={{
                    height: "1px",
                    backgroundColor: "#f5f5f5",
                    margin: "0.5rem 0",
                  }}
                />

                <DetailRow
                  icon={
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                    </svg>
                  }
                  label="Name"
                  value={booking.clientName}
                />
                <DetailRow
                  icon={
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                    </svg>
                  }
                  label="Email"
                  value={booking.clientEmail}
                />
                {booking.clientPhone && (
                  <DetailRow
                    icon={
                      <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                      </svg>
                    }
                    label="Phone"
                    value={booking.clientPhone}
                  />
                )}
              </div>

              {/* Confirmation note */}
              <div
                style={{
                  marginTop: "1.5rem",
                  padding: "1rem 1.25rem",
                  backgroundColor: "#FDF0F4",
                  borderLeft: "2px solid #F4A0B5",
                }}
              >
                <p
                  style={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontSize: "0.72rem",
                    fontWeight: 300,
                    color: "#777",
                    letterSpacing: "0.03em",
                    lineHeight: 1.6,
                  }}
                >
                  A confirmation has been sent to{" "}
                  <span style={{ color: "#F4A0B5", fontWeight: 400 }}>
                    {booking.clientEmail}
                  </span>
                  . Please arrive 5 minutes early.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div
            style={{
              backgroundColor: "#FFFFFF",
              border: "1px solid #efefef",
              borderRadius: "2px",
              padding: "2.5rem",
              textAlign: "center",
              boxShadow: "0 4px 40px rgba(0,0,0,0.06)",
            }}
          >
            <p
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontWeight: 300,
                fontSize: "0.85rem",
                color: "#aaa",
              }}
            >
              Payment confirmed. Your booking details will be sent via email.
            </p>
          </div>
        )}

        <div style={{ textAlign: "center", marginTop: "2.5rem" }}>
          <Link
            href="/"
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: "0.65rem",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "#F4A0B5",
              textDecoration: "none",
              fontWeight: 400,
              transition: "color 0.2s ease",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
            }}
          >
            <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Book Another Appointment
          </Link>
        </div>
      </div>

      <footer
        style={{
          textAlign: "center",
          paddingBottom: "2.5rem",
        }}
      >
        <p
          style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: "0.65rem",
            fontWeight: 300,
            color: "#ccc",
            letterSpacing: "0.08em",
          }}
        >
          &copy; {new Date().getFullYear()} Kateryna&apos;s Laser &amp; Lash Salon. All rights reserved.
        </p>
      </footer>
    </main>
  );
}

function DetailRow({
  icon,
  label,
  value,
  highlight,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "0.75rem",
        padding: "0.75rem 0",
        borderBottom: "1px solid #fafafa",
      }}
    >
      <span style={{ color: "#F4A0B5", marginTop: "0.1rem", flexShrink: 0 }}>
        {icon}
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: "0.58rem",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "#bbb",
            fontWeight: 400,
            marginBottom: "0.2rem",
          }}
        >
          {label}
        </p>
        <p
          style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: "0.82rem",
            fontWeight: highlight ? 500 : 400,
            color: highlight ? "#F4A0B5" : "#0A0A0A",
          }}
        >
          {value}
        </p>
      </div>
    </div>
  );
}
