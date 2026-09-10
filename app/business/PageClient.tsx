"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../lib/auth";

export default function BusinessIndex() {
  const { user, loading } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (loading) return;
    if (user?.role === "business") {
      router.replace(`/business/${user.businessId}`);
    } else {
      router.replace("/business/login");
    }
  }, [user, loading, router]);

  return null;
}
