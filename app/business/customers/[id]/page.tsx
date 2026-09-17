"use client";
import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "../../../lib/auth";
import { useBusinessMe, useBusinessCustomer } from "../../../lib/queries";
import { CustomerDetailView } from "../../CustomerDetail";
import { PanelSkeleton } from "../../../components/feedback/Skeleton";

export default function Page() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  React.useEffect(() => {
    if (!authLoading && !user) router.replace("/business/login");
  }, [user, authLoading, router]);

  const { data: me } = useBusinessMe();
  const { data, isLoading, isError } = useBusinessCustomer(params.id);

  if (authLoading || !user) return <PanelSkeleton navItems={5} />;

  return (
    <div style={{ minHeight: "100vh", background: "var(--surface-page)" }}>
      <CustomerDetailView
        customer={data?.customer || data}
        loading={isLoading}
        error={isError}
        businessName={me?.name || "us"}
        onBack={() => router.back()}
      />
    </div>
  );
}
