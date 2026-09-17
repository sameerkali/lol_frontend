"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../lib/auth";
import {
  useAdminBusiness,
  useUpdateBusiness,
  usePatchBusinessPlan,
  usePatchBusinessStatus,
  useDeleteBusiness,
  useAdminBusinessQr,
  useAdminBusinessDashboard,
  useAdminBusinessCustomers,
} from "../lib/queries";
import { api } from "../lib/api";
import { Button } from "../components/core/Button";
import { Card } from "../components/core/Card";
import { Badge } from "../components/core/Badge";
import { Icon } from "../components/core/Icon";
import { Input } from "../components/forms/Input";
import { Select } from "../components/forms/Select";
import { Dialog } from "../components/feedback/Dialog";
import { Skeleton } from "../components/feedback/Skeleton";
import {
  EarningSection,
  MilestonesSection,
  SignupRewardsSection,
  BrandingSection,
  PinSection,
} from "../business/SettingsPanel";
import { DashboardSection, CustomerTable } from "../business/PanelSections";

const TABS = [
  { value: "dashboard", label: "Dashboard" },
  { value: "general", label: "Earning & check-in" },
  { value: "milestones", label: "Milestones" },
  { value: "customers", label: "Customers" },
  { value: "signup", label: "Signup & rewards" },
  { value: "branding", label: "Branding" },
  { value: "pin", label: "PIN" },
  { value: "qr", label: "QR & link" },
  { value: "account", label: "Owner account" },
  { value: "danger", label: "Danger zone" },
];

const PLAN_OPTIONS = [
  { value: "trial", label: "Trial" },
  { value: "basic", label: "Basic" },
  { value: "pro", label: "Pro" },
];

function OwnerAccountSection({ business, onSave, saving }: { business: any; onSave: (patch: any) => Promise<void>; saving?: boolean }) {
  const [newPassword, setNewPassword] = React.useState("");
  const [saved, setSaved] = React.useState(false);

  const submit = async () => {
    if (newPassword.length < 8) return;
    await onSave({ ownerPassword: newPassword });
    setNewPassword("");
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <Card pad={24}>
      <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 420 }}>
        <div style={{ font: "var(--type-subtitle)", color: "var(--text-strong)" }}>Owner login</div>
        <Input label="Owner email" value={business.owner?.email || ""} disabled onChange={() => {}} />
        <div style={{ font: "var(--type-body-sm)", color: "var(--text-muted)" }}>
          Admin override: reset the owner&apos;s password directly, no current password required.
        </div>
        <Input label="New password" type="password" value={newPassword} onChange={setNewPassword} hint="At least 8 characters." />
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <Button variant="primary" size="sm" onClick={submit} disabled={saving || newPassword.length < 8}>
            {saving ? "Saving..." : "Reset password"}
          </Button>
          {saved && <span style={{ font: "600 13px/1 var(--font-body)", color: "var(--success-ink)" }}>Updated.</span>}
        </div>
      </div>
    </Card>
  );
}

export default function AdminBusinessDetail({ id }: { id: string }) {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [tab, setTab] = React.useState("dashboard");
  const [showStatusConfirm, setShowStatusConfirm] = React.useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = React.useState("");
  const [pinRevealDash, setPinRevealDash] = React.useState(false);

  const [customerSearch, setCustomerSearch] = React.useState("");
  const [customerSort, setCustomerSort] = React.useState("newest");
  const [onlyUnredeemed, setOnlyUnredeemed] = React.useState(false);
  const [customerTier, setCustomerTier] = React.useState("");

  React.useEffect(() => {
    if (!authLoading && !user) router.replace("/admin/login");
  }, [user, authLoading, router]);

  const { data: business, isLoading, isError } = useAdminBusiness(id);
  const { data: qr } = useAdminBusinessQr(id);
  const { data: dash } = useAdminBusinessDashboard(id);
  const customerParams = React.useMemo(() => {
    const p: Record<string, string> = { sort: customerSort };
    if (customerSearch.trim()) p.phone = customerSearch.trim();
    if (onlyUnredeemed) p.hasUnredeemedRewards = "true";
    if (customerTier) p.tier = customerTier;
    return p;
  }, [customerSearch, customerSort, onlyUnredeemed, customerTier]);
  const { data: custData, isLoading: custLoading } = useAdminBusinessCustomers(id, customerParams);
  const { data: birthdayData } = useAdminBusinessCustomers(id, { dobToday: "true", limit: "10" });
  const updateMut = useUpdateBusiness();
  const planMut = usePatchBusinessPlan();
  const statusMut = usePatchBusinessStatus();
  const deleteMut = useDeleteBusiness();

  const customersList = Array.isArray(custData?.customers || custData) ? (custData?.customers || custData) : [];
  const birthdayList = Array.isArray(birthdayData?.customers || birthdayData) ? (birthdayData?.customers || birthdayData) : [];
  const allTierNames: string[] = Array.from(
    new Set([...(business?.tiers || []).map((t: any) => t.name), ...customersList.map((c: any) => c.ruleSnapshot?.tierName).filter(Boolean)])
  );

  if (authLoading || !user) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--surface-page)", padding: 32 }}>
        <div style={{ maxWidth: 960, margin: "0 auto", display: "flex", flexDirection: "column", gap: 24 }}>
          <Skeleton width={140} height={26} />
        </div>
      </div>
    );
  }

  const save = (patch: any) => updateMut.mutateAsync({ id, ...patch });

  const active = business?.status === "active";

  const toggleStatus = async () => {
    await statusMut.mutateAsync({ id, status: active ? "inactive" : "active" });
    setShowStatusConfirm(false);
  };

  const doDelete = async () => {
    await deleteMut.mutateAsync(id);
    router.replace("/admin");
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--surface-page)" }}>
      <div className="lol-page-pad" style={{ maxWidth: 960, margin: "0 auto", padding: 32, display: "flex", flexDirection: "column", gap: 24 }}>
        <button
          onClick={() => router.push("/admin")}
          style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "transparent", border: 0, cursor: "pointer", color: "var(--text-muted)", font: "600 14px/1 var(--font-body)", padding: 0, width: "fit-content" }}
        >
          <Icon name="arrow-left" size={16} /> Back to businesses
        </button>

        {isError ? (
          <Card pad={40} style={{ textAlign: "center" }}>
            <Icon name="alert-triangle" size={28} color="var(--coral-700)" />
            <div style={{ font: "var(--type-subtitle)", color: "var(--text-strong)", marginTop: 12 }}>
              This business couldn&apos;t be loaded
            </div>
            <div style={{ font: "var(--type-body-sm)", color: "var(--text-muted)", marginTop: 6 }}>
              It may have been deleted, or the link is wrong.
            </div>
            <Button variant="secondary" size="sm" onClick={() => router.push("/admin")} style={{ marginTop: 16 }}>
              Back to businesses
            </Button>
          </Card>
        ) : isLoading || !business ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <Skeleton width={260} height={30} />
                <Skeleton width={200} height={14} />
              </div>
              <Skeleton width={160} height={48} radius="var(--radius-md)" />
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} width={110} height={38} radius="var(--radius-pill)" />
              ))}
            </div>
            <Skeleton height={280} radius="var(--radius-lg)" />
          </div>
        ) : (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, flexWrap: "wrap" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <h1 style={{ margin: 0, font: "var(--type-title)", letterSpacing: "var(--tracking-display)", color: "var(--text-strong)" }}>{business.name}</h1>
                  <Badge tone={active ? "success" : "danger"} size="sm">{business.status}</Badge>
                </div>
                <div style={{ font: "var(--type-mono)", color: "var(--text-muted)", fontSize: 13, marginTop: 6 }}>
                  {business.slug} · {business.owner?.email}
                </div>
              </div>
              <div style={{ display: "flex", gap: 12, alignItems: "flex-end" }}>
                <Select
                  label="Plan"
                  value={business.plan}
                  onChange={(v) => planMut.mutate({ id, plan: v })}
                  options={PLAN_OPTIONS}
                  style={{ width: 160 }}
                />
                <Button
                  variant={active ? "danger" : "success"}
                  size="sm"
                  icon={<Icon name={active ? "shield-off" : "shield-check"} size={16} />}
                  onClick={() => setShowStatusConfirm(true)}
                >
                  {active ? "Deactivate" : "Activate"}
                </Button>
              </div>
            </div>

            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              {TABS.map((t) => (
                <button
                  key={t.value}
                  onClick={() => setTab(t.value)}
                  style={{
                    padding: "10px 18px",
                    borderRadius: "var(--radius-pill)",
                    border: tab === t.value ? "var(--border)" : "3px solid transparent",
                    background: tab === t.value ? "var(--paper-000)" : "transparent",
                    boxShadow: tab === t.value ? "var(--pop-1)" : "none",
                    font: "var(--type-button)",
                    color: t.value === "danger" ? "var(--coral-700)" : tab === t.value ? "var(--text-strong)" : "var(--text-muted)",
                    cursor: "pointer",
                  }}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {tab === "dashboard" && (
              <DashboardSection
                title={business.name}
                dash={dash}
                list={customersList}
                birthdayList={birthdayList}
                pin={business.pin}
                pinRevealed={pinRevealDash}
                onTogglePinReveal={() => setPinRevealDash((v) => !v)}
                onEditPin={() => setTab("pin")}
                padded={false}
              />
            )}
            {tab === "general" && <EarningSection business={business} onSave={save} saving={updateMut.isPending} key={`g-${business.updatedAt}`} />}
            {tab === "milestones" && <MilestonesSection business={business} onSave={save} saving={updateMut.isPending} key={`m-${business.updatedAt}`} />}
            {tab === "customers" && (
              <CustomerTable
                customers={customersList}
                loading={custLoading}
                tierNames={allTierNames}
                search={customerSearch}
                onSearchChange={setCustomerSearch}
                sort={customerSort}
                onSortChange={setCustomerSort}
                tier={customerTier}
                onTierChange={setCustomerTier}
                onlyUnredeemed={onlyUnredeemed}
                onOnlyUnredeemedChange={setOnlyUnredeemed}
                onExport={() => api.download(`/admin/businesses/${id}/customers/export?${new URLSearchParams(customerParams).toString()}`, "customers.csv")}
                onRowClick={(c) => router.push(`/admin/businesses/${id}/customers/${c._id || c.id}`)}
                padded={false}
              />
            )}
            {tab === "signup" && <SignupRewardsSection business={business} onSave={save} saving={updateMut.isPending} key={`s-${business.updatedAt}`} />}
            {tab === "branding" && <BrandingSection branding={business.branding || {}} onSave={(b) => save({ branding: b })} saving={updateMut.isPending} key={`b-${business.updatedAt}`} />}
            {tab === "pin" && (
              <PinSection
                pin={business.pin}
                hasPin={!!business.pin}
                onSave={(pin) => save({ pin })}
                saving={updateMut.isPending}
                key={`p-${business.updatedAt}`}
              />
            )}
            {tab === "qr" && (
              <Card pad={24} style={{ maxWidth: 420 }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <div style={{ font: "var(--type-subtitle)", color: "var(--text-strong)" }}>Customer page link</div>
                  {qr?.qrCodeDataUrl ? (
                    <>
                      <img src={qr.qrCodeDataUrl} alt="QR Code" style={{ width: 200, height: 200 }} />
                      <div style={{ font: "var(--type-body-sm)", color: "var(--text-muted)", wordBreak: "break-all" }}>{qr.link}</div>
                      <div style={{ display: "flex", gap: 12 }}>
                        <Button variant="secondary" size="sm" icon={<Icon name="copy" size={16} />} onClick={() => navigator.clipboard?.writeText(qr.link)}>
                          Copy link
                        </Button>
                        <Button
                          variant="primary"
                          size="sm"
                          icon={<Icon name="download" size={16} />}
                          onClick={() => {
                            const a = document.createElement("a");
                            a.href = qr.qrCodeDataUrl;
                            a.download = `${business.slug || "loyalty"}-qr.png`;
                            a.click();
                          }}
                        >
                          Download PNG
                        </Button>
                      </div>
                    </>
                  ) : (
                    <Skeleton width={200} height={200} />
                  )}
                </div>
              </Card>
            )}
            {tab === "account" && <OwnerAccountSection business={business} onSave={save} saving={updateMut.isPending} />}
            {tab === "danger" && (
              <Card pad={24} style={{ border: "3px solid var(--coral-500)", maxWidth: 480 }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    <Icon name="alert-triangle" size={20} color="var(--coral-700)" />
                    <div style={{ font: "var(--type-subtitle)", color: "var(--coral-700)" }}>Delete this business</div>
                  </div>
                  <div style={{ font: "var(--type-body-sm)", color: "var(--text-muted)" }}>
                    This permanently deletes {business.name} and cascades to all of its customers and visit history. This cannot be undone.
                  </div>
                  <Button variant="danger" size="sm" icon={<Icon name="trash-2" size={16} />} onClick={() => setShowDeleteConfirm(true)}>
                    Delete business
                  </Button>
                </div>
              </Card>
            )}
          </>
        )}
      </div>

      <Dialog
        open={showStatusConfirm}
        title={active ? "Deactivate business?" : "Activate business?"}
        onClose={() => setShowStatusConfirm(false)}
        width={400}
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setShowStatusConfirm(false)}>Cancel</Button>
            <Button variant={active ? "danger" : "success"} size="sm" onClick={toggleStatus} disabled={statusMut.isPending}>
              {active ? "Deactivate" : "Activate"}
            </Button>
          </>
        }
      >
        {active
          ? "The owner will be logged out immediately and their customer page will stop working until reactivated."
          : "This reactivates the owner's login and their customer-facing loyalty page."}
      </Dialog>

      <Dialog
        open={showDeleteConfirm}
        title="Delete business"
        onClose={() => { setShowDeleteConfirm(false); setDeleteConfirmText(""); }}
        width={420}
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => { setShowDeleteConfirm(false); setDeleteConfirmText(""); }}>Cancel</Button>
            <Button variant="danger" size="sm" onClick={doDelete} disabled={deleteConfirmText !== business?.name || deleteMut.isPending}>
              {deleteMut.isPending ? "Deleting..." : "Delete permanently"}
            </Button>
          </>
        }
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div>
            Type <strong>{business?.name}</strong> to confirm. This deletes all customers and visit history for this business.
          </div>
          <Input value={deleteConfirmText} onChange={setDeleteConfirmText} placeholder={business?.name} />
        </div>
      </Dialog>
    </div>
  );
}
