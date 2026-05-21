import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ReviewQ — Turn happy customers into Google reviews",
  description:
    "Restaurants get a QR code. Customers scan, rate, and post a polished Google review in 10 seconds.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
