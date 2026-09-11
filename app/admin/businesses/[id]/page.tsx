"use client";
import { useParams } from "next/navigation";
import AdminBusinessDetail from "../../AdminBusinessDetail";

export default function Page() {
  const params = useParams<{ id: string }>();
  return <AdminBusinessDetail id={params.id} />;
}
