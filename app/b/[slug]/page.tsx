import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CustomerPage from "../../customer/CustomerPage";
import { api } from "../../lib/api";

interface PublicBusiness {
  name: string;
  location?: string;
}

// This is the actual link put into every QR code / NFC tag
// (see backend/src/services/qr.service.js -> customerPageUrl). It didn't
// have a matching route in the frontend at all, so every scan 404'd.
async function getBusiness(slug: string): Promise<PublicBusiness | null> {
  try {
    return await api.get<PublicBusiness>(`/public/businesses/${slug}`);
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const biz = await getBusiness(slug);

  if (!biz) {
    return { title: "Loyalty card not found — lol" };
  }

  const title = `${biz.name} — stamp card`;
  const description = `Track your visits and rewards at ${biz.name}. No app, no password — just your phone number.`;

  return {
    title,
    description,
    openGraph: { title, description, type: "website" },
    twitter: { card: "summary", title, description },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const biz = await getBusiness(slug);

  if (!biz) notFound();

  return <CustomerPage slug={slug} />;
}
