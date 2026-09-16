import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "./lib/Providers";

export const metadata: Metadata = {
  title: "Digital Stamp Card",
  description: "A digital stamp card for restaurants and cafes. Tap, stamp, reward.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
