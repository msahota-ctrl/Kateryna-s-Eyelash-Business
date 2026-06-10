import BookingWizard from "@/components/BookingWizard";

export default function Home() {
  return (
    <main className="min-h-screen bg-rose-gold-bg">
      {/* Header */}
      <header className="bg-white border-b border-rose-gold/10 shadow-soft">
        <div className="max-w-4xl mx-auto px-4 py-5 flex flex-col items-center">
          <p className="text-rose-gold text-xs tracking-[0.3em] uppercase font-medium mb-1">
            Beauty Studio
          </p>
          <h1 className="font-serif text-3xl md:text-4xl text-gray-800 tracking-wide">
            Kateryna&apos;s Lashes
          </h1>
          <p className="text-gray-400 text-sm mt-1 font-light">
            Professional Eyelash Extensions
          </p>
        </div>
      </header>

      {/* Booking Wizard */}
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="text-center mb-8">
          <h2 className="font-serif text-2xl md:text-3xl text-gray-800 mb-2">
            Book Your Appointment
          </h2>
          <p className="text-gray-500 text-sm">
            Select your service, choose a time, and we&apos;ll take care of the rest.
          </p>
        </div>
        <BookingWizard />
      </div>

      {/* Footer */}
      <footer className="mt-20 pb-8 text-center">
        <p className="text-gray-400 text-xs">
          &copy; {new Date().getFullYear()} Kateryna&apos;s Lashes. All rights reserved.
        </p>
      </footer>
    </main>
  );
}
