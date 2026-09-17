"use client";
import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "../../../../../lib/auth";
import { useAdminBusiness, useAdminBusinessCustomer } from "../../../../../lib/queries";
import { CustomerDetailView } from "../../../../../business/CustomerDetail";
import { Skeleton } from "../../../../../components/feedback/Skeleton";

export default function Page() {
  const params = useParams<{ id: string; customerId: string }>();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  React.useEffect(() => {
    if (!authLoading && !user) router.replace("/admin/login");
  }, [user, authLoading, router]);

  const { data: business } = useAdminBusiness(params.id);
  const { data, isLoading, isError } = useAdminBusinessCustomer(params.id, params.customerId);

  if (authLoading || !user) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--surface-page)", padding: 32 }}>
        <Skeleton width={140} height={26} />
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--surface-page)" }}>
      <CustomerDetailView
        customer={data?.customer || data}
        loading={isLoading}
        error={isError}
        businessName={business?.name || "us"}
        onBack={() => router.back()}
      />
    </div>
  );
}
