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
      <main className="min-h-screen bg-rose-gold-bg flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="font-serif text-3xl text-gray-800 mb-4">Invalid Link</h1>
          <p className="text-gray-500 mb-6">No booking session found.</p>
          <Link href="/" className="btn-primary inline-block">
            Book an Appointment
          </Link>
        </div>
      </main>
    );
  }

  const booking = await getBookingDetails(sessionId);

  return (
    <main className="min-h-screen bg-rose-gold-bg">
      {/* Header */}
      <header className="bg-white border-b border-rose-gold/10 shadow-soft">
        <div className="max-w-4xl mx-auto px-4 py-5 flex flex-col items-center">
          <p className="text-rose-gold text-xs tracking-[0.3em] uppercase font-medium mb-1">
            Beauty Studio
          </p>
          <h1 className="font-serif text-3xl md:text-4xl text-gray-800 tracking-wide">
            Kateryna&apos;s Laser &amp; Lash Salon
          </h1>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-16">
        {/* Success Icon */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-rose-gold/10 mb-6">
            <svg
              className="w-10 h-10 text-rose-gold"
              fill="none"
              stroke="currentColor"
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
          <h2 className="font-serif text-3xl md:text-4xl text-gray-800 mb-3">
            Booking Confirmed!
          </h2>
          <p className="text-gray-500 text-base">
            Thank you for your booking. We can&apos;t wait to see you!
          </p>
        </div>

        {booking ? (
          <div className="bg-white rounded-2xl shadow-soft-md border border-rose-gold/10 overflow-hidden">
            {/* Decorative top bar */}
            <div className="h-1.5 bg-gradient-to-r from-rose-gold-light via-rose-gold to-rose-gold-dark" />

            <div className="p-8">
              <h3 className="font-serif text-xl text-gray-800 mb-6">
                Appointment Details
              </h3>

              <div className="space-y-4">
                <DetailRow
                  icon={
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                    </svg>
                  }
                  label="Service"
                  value={booking.service}
                />
                <DetailRow
                  icon={
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  }
                  label="Amount Paid"
                  value={`$${booking.price}`}
                />
                <DetailRow
                  icon={
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                    </svg>
                  }
                  label="Date"
                  value={formatDate(booking.date)}
                />
                <DetailRow
                  icon={
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  }
                  label="Time"
                  value={formatTime(booking.time)}
                />

                <div className="border-t border-gray-100 pt-4 mt-4">
                  <DetailRow
                    icon={
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                      </svg>
                    }
                    label="Name"
                    value={booking.clientName}
                  />
                  <DetailRow
                    icon={
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                      </svg>
                    }
                    label="Email"
                    value={booking.clientEmail}
                  />
                  {booking.clientPhone && (
                    <DetailRow
                      icon={
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                        </svg>
                      }
                      label="Phone"
                      value={booking.clientPhone}
                    />
                  )}
                </div>
              </div>

              {/* Note */}
              <div className="mt-6 p-4 bg-rose-gold-bg rounded-xl">
                <p className="text-sm text-gray-600 text-center">
                  A confirmation has been sent to{" "}
                  <span className="font-medium text-rose-gold">{booking.clientEmail}</span>.
                  Please arrive 5 minutes early.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-soft p-8 text-center">
            <p className="text-gray-500">
              Payment confirmed! Your booking details will be sent via email.
            </p>
          </div>
        )}

        <div className="text-center mt-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-rose-gold hover:text-rose-gold-dark text-sm font-medium transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Book Another Appointment
          </Link>
        </div>
      </div>

      <footer className="pb-8 text-center">
        <p className="text-gray-400 text-xs">
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
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 py-2">
      <span className="text-rose-gold mt-0.5 flex-shrink-0">{icon}</span>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">{label}</p>
        <p className="text-gray-800 font-medium mt-0.5">{value}</p>
      </div>
    </div>
  );
}
