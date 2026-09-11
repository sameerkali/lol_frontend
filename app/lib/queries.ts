"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "./api";

/* ======================== ADMIN ======================== */

export function useAdminStats() {
  return useQuery({ queryKey: ["admin", "stats"], queryFn: () => api.get<any>("/admin/stats") });
}

export interface BusinessTemplate {
  key: string;
  label: string;
  description: string;
}

export function useAdminTemplates() {
  return useQuery({
    queryKey: ["admin", "templates"],
    queryFn: () => api.get<BusinessTemplate[]>("/admin/templates"),
    staleTime: 5 * 60 * 1000,
  });
}

export function useAdminBusinesses(params?: Record<string, string>) {
  const q = params ? "?" + new URLSearchParams(params).toString() : "";
  return useQuery({ queryKey: ["admin", "businesses", params], queryFn: () => api.get<any>(`/admin/businesses${q}`) });
}

export function useAdminBusiness(id: string) {
  return useQuery({ queryKey: ["admin", "business", id], queryFn: () => api.get<any>(`/admin/businesses/${id}`), enabled: !!id });
}

export function useCreateBusiness() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: any) => api.post<any>("/admin/businesses", body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "businesses"] }),
    meta: { silent: true }, // the create form renders its own inline field errors
  });
}

export function useUpdateBusiness() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...body }: { id: string } & any) => api.put<any>(`/admin/businesses/${id}`, body),
    onSuccess: (_, v) => { qc.invalidateQueries({ queryKey: ["admin", "businesses"] }); qc.invalidateQueries({ queryKey: ["admin", "business", v.id] }); },
  });
}

export function useDeleteBusiness() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.del<any>(`/admin/businesses/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "businesses"] }),
  });
}

export function usePatchBusinessPlan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, plan }: { id: string; plan: string }) => api.patch<any>(`/admin/businesses/${id}/plan`, { plan }),
    onSuccess: (_, v) => { qc.invalidateQueries({ queryKey: ["admin", "businesses"] }); qc.invalidateQueries({ queryKey: ["admin", "business", v.id] }); },
  });
}

export function usePatchBusinessStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => api.patch<any>(`/admin/businesses/${id}/status`, { status }),
    onSuccess: (_, v) => { qc.invalidateQueries({ queryKey: ["admin", "businesses"] }); qc.invalidateQueries({ queryKey: ["admin", "business", v.id] }); },
  });
}

export function useAdminBusinessQr(id: string) {
  return useQuery({ queryKey: ["admin", "business", id, "qr"], queryFn: () => api.get<any>(`/admin/businesses/${id}/qr`), enabled: !!id });
}

/* ======================== BUSINESS ======================== */

export function useBusinessMe() {
  return useQuery({ queryKey: ["business", "me"], queryFn: () => api.get<any>("/business/me") });
}

export function useBusinessDashboard(from?: string, to?: string) {
  const params = new URLSearchParams();
  if (from) params.set("from", from);
  if (to) params.set("to", to);
  const q = params.toString() ? `?${params}` : "";
  return useQuery({ queryKey: ["business", "dashboard", from, to], queryFn: () => api.get<any>(`/business/dashboard${q}`), refetchInterval: 20_000 });
}

export function useBusinessCustomers(params?: Record<string, string>) {
  const q = params ? "?" + new URLSearchParams(params).toString() : "";
  return useQuery({ queryKey: ["business", "customers", params], queryFn: () => api.get<any>(`/business/customers${q}`), refetchInterval: 20_000 });
}

export function useUpdateBusinessSettings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: any) => api.put<any>("/business/me", body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["business", "me"] }),
  });
}

export function useUpdateBusinessPin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: { pin: string }) => api.put<any>("/business/me/pin", body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["business", "me"] }),
    meta: { silent: true }, // the PIN form renders its own inline field error
  });
}

export function useBusinessQr() {
  return useQuery({ queryKey: ["business", "qr"], queryFn: () => api.get<any>("/business/me/qr") });
}

export function useUpdateBusinessBranding() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: { primaryColor?: string; secondaryColor?: string }) => api.put<any>("/business/me/branding", body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["business", "me"] }),
  });
}

export function useChangeBusinessPassword() {
  return useMutation({
    mutationFn: (body: { currentPassword: string; newPassword: string }) => api.post<any>("/business/auth/change-password", body),
    meta: { silent: true }, // the account form renders its own inline error
  });
}

/* ======================== PUBLIC (customer) ======================== */

export function usePublicBusiness(slug: string) {
  return useQuery({ queryKey: ["public", "business", slug], queryFn: () => api.get<any>(`/public/businesses/${slug}`), enabled: !!slug, meta: { silent: true } });
}

export function useCustomerLookup(slug: string) {
  return useMutation({ mutationFn: (phone: string) => api.post<any>(`/public/businesses/${slug}/lookup`, { phone }), meta: { silent: true } });
}

export function useCustomerSignup(slug: string) {
  return useMutation({ mutationFn: (body: { phone: string; name?: string; email?: string; birthday?: string }) => api.post<any>(`/public/businesses/${slug}/signup`, body), meta: { silent: true } });
}

export function useCustomerCard(slug: string, phone: string) {
  return useQuery({ queryKey: ["public", "card", slug, phone], queryFn: () => api.get<any>(`/public/businesses/${slug}/card/${phone}`), enabled: !!slug && !!phone, meta: { silent: true } });
}

export function useCustomerHistory(slug: string, phone: string) {
  return useQuery({ queryKey: ["public", "history", slug, phone], queryFn: () => api.get<any>(`/public/businesses/${slug}/history/${phone}`), enabled: !!slug && !!phone, meta: { silent: true } });
}

export function useMarkVisit(slug: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: { phone: string; billAmount?: number; pin?: string }) => api.post<any>(`/public/businesses/${slug}/visits`, body),
    onSuccess: (_, v) => { qc.invalidateQueries({ queryKey: ["public", "card", slug, v.phone] }); qc.invalidateQueries({ queryKey: ["public", "history", slug, v.phone] }); },
    meta: { silent: true },
  });
}

export function useRedeem(slug: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: { phone: string; milestoneUnlockedId: string; pin: string }) => api.post<any>(`/public/businesses/${slug}/redeem`, body),
    onSuccess: (_, v) => { qc.invalidateQueries({ queryKey: ["public", "card", slug, v.phone] }); qc.invalidateQueries({ queryKey: ["public", "history", slug, v.phone] }); },
    meta: { silent: true },
  });
}
