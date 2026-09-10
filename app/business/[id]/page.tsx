import { notFound } from "next/navigation";
import { getBusiness } from "../data";
import BusinessPage from "./BusinessPage";

export function generateStaticParams() {
  return [{ id: "kaapi" }, { id: "chai" }, { id: "blue" }];
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const business = getBusiness(id);
  if (!business) notFound();
  return <BusinessPage business={business} />;
}
