import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kateryna's Lashes | Book Your Appointment",
  description:
    "Book your professional eyelash extension appointment with Kateryna. Classic and Volume sets, fills, and removals available.",
  keywords: "eyelash extensions, lash artist, booking, classic lashes, volume lashes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen bg-rose-gold-bg font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
