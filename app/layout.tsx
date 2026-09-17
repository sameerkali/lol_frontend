import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "./lib/Providers";

// Vercel sets this automatically for the production deployment; falls back to
// localhost so dev builds don't warn about an unresolved metadataBase.
const siteUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
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
