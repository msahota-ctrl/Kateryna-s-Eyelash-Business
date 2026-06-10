import BookingWizard from "@/components/BookingWizard";

export default function Home() {
  return (
    <main
      style={{ minHeight: "100vh", backgroundColor: "#FDF0F4" }}
      className="jungle-bg"
    >
      {/* Black header bar */}
      <header style={{ backgroundColor: "#0A0A0A" }}>
        <div
          style={{
            maxWidth: "900px",
            margin: "0 auto",
            padding: "2.5rem 1.5rem 2.75rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <p
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: "0.55rem",
              letterSpacing: "0.35em",
              textTransform: "uppercase",
              color: "#F4A0B5",
              fontWeight: 400,
              marginBottom: "0.85rem",
            }}
          >
            Beauty Studio
          </p>
          <h1
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontWeight: 300,
              fontSize: "clamp(1.85rem, 5vw, 3rem)",
              color: "#FFFFFF",
              letterSpacing: "0.08em",
              textAlign: "center",
              marginBottom: "1.1rem",
            }}
          >
            Kateryna&apos;s Laser &amp; Lash Salon
          </h1>
          {/* Thin blush divider */}
          <div
            style={{
              width: "56px",
              height: "1px",
              backgroundColor: "#F4A0B5",
              marginBottom: "1rem",
            }}
          />
          <p
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: "0.62rem",
              fontWeight: 300,
              color: "rgba(244,160,181,0.55)",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
            }}
          >
            Professional Eyelash Extensions
          </p>
        </div>
      </header>

      {/* Booking section */}
      <div
        style={{
          maxWidth: "720px",
          margin: "0 auto",
          padding: "4rem 1rem 2rem",
        }}
      >
        {/* Section heading */}
        <div style={{ textAlign: "center", marginBottom: "2.75rem" }}>
          <h2
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontStyle: "italic",
              fontWeight: 300,
              fontSize: "clamp(1.5rem, 4vw, 2.25rem)",
              color: "#0A0A0A",
              letterSpacing: "0.04em",
              marginBottom: "1rem",
            }}
          >
            Reserve Your Appointment
          </h2>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.75rem",
              marginBottom: "0.9rem",
            }}
          >
            <div style={{ width: "36px", height: "1px", backgroundColor: "#F4A0B5" }} />
            <div
              style={{
                width: "5px",
                height: "5px",
                borderRadius: "50%",
                backgroundColor: "#F4A0B5",
              }}
            />
            <div style={{ width: "36px", height: "1px", backgroundColor: "#F4A0B5" }} />
          </div>
          <p
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: "0.75rem",
              fontWeight: 300,
              color: "#aaa",
              letterSpacing: "0.06em",
            }}
          >
            Select your service, choose a time, and we&apos;ll take care of the rest.
          </p>
        </div>

        <BookingWizard />
      </div>

      {/* Footer */}
      <footer
        style={{
          marginTop: "5rem",
          paddingBottom: "3rem",
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: "32px",
            height: "1px",
            backgroundColor: "#F4A0B5",
            margin: "0 auto 1.25rem",
          }}
        />
        <p
          style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: "0.62rem",
            fontWeight: 300,
            color: "#ccc",
            letterSpacing: "0.1em",
          }}
        >
          &copy; {new Date().getFullYear()} Kateryna&apos;s Laser &amp; Lash Salon. All rights reserved.
        </p>
      </footer>
    </main>
  );
}
