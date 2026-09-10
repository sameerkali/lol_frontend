import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "lol — Digital Stamp Card",
  description: "A digital stamp card for restaurants and cafes. Tap, stamp, reward.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
