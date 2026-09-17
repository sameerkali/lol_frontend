"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../lib/auth";
import {
  useBusinessMe,
  useBusinessDashboard,
  useBusinessCustomers,
  useUpdateBusinessSettings,
  useUpdateBusinessPin,
  useUpdateBusinessBranding,
  useChangeBusinessPassword,
  useBusinessQr,
} from "../lib/queries";
import { api } from "../lib/api";
import { Button } from "../components/core/Button";
import { Card } from "../components/core/Card";
import { Icon } from "../components/core/Icon";
import { Input } from "../components/forms/Input";
import { SideNav } from "../components/navigation/SideNav";
import { Dialog } from "../components/feedback/Dialog";
import { PanelSkeleton, Skeleton } from "../components/feedback/Skeleton";
import { splitFieldErrors } from "../lib/validation";
import {
  EarningSection,
  MilestonesSection,
  SignupRewardsSection,
  BrandingSection,
  PinSection,
} from "./SettingsPanel";
import { SectionHeader, DashboardSection, CustomerTable, useCustomerListFilters, normalizeList, deriveTierNames } from "./PanelSections";

const NAV = [
  { value: "dashboard", label: "Dashboard", icon: "layout-dashboard" },
  { value: "milestones", label: "Milestones", icon: "flag" },
  { value: "customers", label: "Customers", icon: "users" },
  { value: "settings", label: "Settings", icon: "settings" },
  { value: "qr", label: "QR Code", icon: "qr-code" },
];

const SETTINGS_TABS = [
  { value: "general", label: "Earning & check-in" },
  { value: "signup", label: "Signup & rewards" },
  { value: "branding", label: "Branding" },
  { value: "pin", label: "PIN" },
  { value: "account", label: "Account" },
];

function AccountSection() {
  const changeMut = useChangeBusinessPassword();
  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [error, setError] = React.useState("");

  const submit = async () => {
    setError("");
    try {
      await changeMut.mutateAsync({ currentPassword, newPassword });
      setCurrentPassword("");
      setNewPassword("");
    } catch (e: any) {
      setError(e.message || "Failed to change password");
    }
  };

  return (
    <Card pad={24}>
      <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 420 }}>
        <div style={{ font: "var(--type-subtitle)", color: "var(--text-strong)" }}>Change password</div>
        <Input label="Current password" type="password" value={currentPassword} onChange={setCurrentPassword} />
        <Input label="New password" type="password" value={newPassword} onChange={setNewPassword} hint="At least 8 characters." />
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <Button variant="primary" size="sm" onClick={submit} disabled={changeMut.isPending || !currentPassword || newPassword.length < 8}>
            {changeMut.isPending ? "Updating..." : "Update password"}
          </Button>
          {changeMut.isSuccess && <span style={{ font: "600 13px/1 var(--font-body)", color: "var(--success-ink)" }}>Updated.</span>}
        </div>
        {error && <div role="alert" style={{ font: "600 14px/1.4 var(--font-body)", color: "var(--danger-ink)" }}>{error}</div>}
      </div>
    </Card>
  );
}

export default function BusinessPanel() {
  const router = useRouter();
  const { user, logout, loading: authLoading } = useAuth();
  const [tab, setTab] = React.useState("dashboard");
  const [settingsTab, setSettingsTab] = React.useState<"general" | "signup" | "branding" | "pin" | "account">("general");
  const [showLogoutConfirm, setShowLogoutConfirm] = React.useState(false);
  const [pinRevealDash, setPinRevealDash] = React.useState(false);

  const {
    search: customerSearch, setSearch: setCustomerSearch,
    sort: customerSort, setSort: setCustomerSort,
    onlyUnredeemed, setOnlyUnredeemed,
    tier: customerTier, setTier: setCustomerTier,
    params: customerParams,
  } = useCustomerListFilters();

  React.useEffect(() => {
    if (!authLoading && !user) router.replace("/business/login");
  }, [user, authLoading, router]);

  const { data: me, isLoading: meLoading } = useBusinessMe();
  const { data: dash } = useBusinessDashboard();
  const { data: custData, isLoading: custLoading } = useBusinessCustomers(customerParams);
  const { data: birthdayData } = useBusinessCustomers({ dobToday: "true", limit: "10" });
  const { data: qr } = useBusinessQr();

  const updateMut = useUpdateBusinessSettings();
  const pinMut = useUpdateBusinessPin();
  const brandingMut = useUpdateBusinessBranding();

  const handleLogout = () => { logout(); router.replace("/business/login"); };

  if (authLoading || !user) return <PanelSkeleton navItems={5} />;

  const b = me || {};
  const list = normalizeList(custData);
  const birthdayList = normalizeList(birthdayData);
  const allTierNames = deriveTierNames(b.tiers, list);

  const savePin = async (pin: string) => {
    await pinMut.mutateAsync({ pin });
  };
  const pinFieldError = (() => {
    if (!pinMut.isError) return "";
    const err = pinMut.error as any;
    const { fields, general } = splitFieldErrors(err?.details, ["pin"] as const);
    return fields.pin || general.join(" ") || err?.message || "";
  })();

  const Sidebar = (
    <SideNav
      items={NAV}
      value={tab}
      onChange={setTab}
      brand="lol"
      footer={
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ font: "var(--type-body-sm)", color: "var(--ink-300)" }}>{b.name || "Business"}</div>
          <div style={{ font: "var(--type-mono)", color: "var(--ink-500)", fontSize: 11 }}>{user.email}</div>
          <button
            onClick={() => setShowLogoutConfirm(true)}
            style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", background: "var(--ink-700)", border: "3px solid var(--ink-500)", borderRadius: "var(--radius-pill)", color: "var(--ink-300)", font: "var(--type-button)", cursor: "pointer", marginTop: 4 }}
          >
            <Icon name="log-out" size={16} /> Logout
          </button>
        </div>
      }
    />
  );

  /* ---------- Dashboard ---------- */
  const Dashboard = (
    <DashboardSection
      title={b.name || "..."}
      dash={dash}
      list={list}
      birthdayList={birthdayList}
      pin={b.pin}
      pinRevealed={pinRevealDash}
      onTogglePinReveal={() => setPinRevealDash((v) => !v)}
      onEditPin={() => { setTab("settings"); setSettingsTab("pin"); }}
    />
  );

  /* ---------- Milestones ---------- */
  const Milestones = (
    <div className="lol-page-pad" style={{ padding: 32, display: "flex", flexDirection: "column", gap: 28 }}>
      <SectionHeader eyebrow="Milestones" title="Reward ladder" />
      {meLoading ? (
        <Skeleton height={320} radius="var(--radius-lg)" />
      ) : (
        <MilestonesSection business={b} onSave={(patch) => updateMut.mutateAsync(patch)} saving={updateMut.isPending} key={b.updatedAt} />
      )}
    </div>
  );

  /* ---------- Customers ---------- */
  const Customers = (
    <CustomerTable
      customers={list}
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
      onExport={() => api.download(`/business/customers/export?${new URLSearchParams(customerParams).toString()}`, "customers.csv")}
      onRowClick={(c) => router.push(`/business/customers/${c._id || c.id}`)}
    />
  );

  /* ---------- Settings ---------- */
  const Settings = (
    <div className="lol-page-pad" style={{ padding: 32, display: "flex", flexDirection: "column", gap: 28 }}>
      <SectionHeader eyebrow="Settings" title="Business settings" />
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        {SETTINGS_TABS.map((s) => (
          <button
            key={s.value}
            onClick={() => setSettingsTab(s.value as any)}
            style={{
              padding: "10px 20px",
              borderRadius: "var(--radius-pill)",
              border: settingsTab === s.value ? "var(--border)" : "3px solid transparent",
              background: settingsTab === s.value ? "var(--paper-000)" : "transparent",
              boxShadow: settingsTab === s.value ? "var(--pop-1)" : "none",
              font: "var(--type-button)",
              color: settingsTab === s.value ? "var(--text-strong)" : "var(--text-muted)",
              cursor: "pointer",
            }}
          >
            {s.label}
          </button>
        ))}
      </div>
      {meLoading ? (
        <Skeleton height={320} radius="var(--radius-lg)" />
      ) : (
        <>
          {settingsTab === "general" && (
            <EarningSection business={b} onSave={(patch) => updateMut.mutateAsync(patch)} saving={updateMut.isPending} key={`general-${b.updatedAt}`} />
          )}
          {settingsTab === "signup" && (
            <SignupRewardsSection business={b} onSave={(patch) => updateMut.mutateAsync(patch)} saving={updateMut.isPending} key={`signup-${b.updatedAt}`} />
          )}
          {settingsTab === "branding" && (
            <BrandingSection branding={b.branding || {}} onSave={(patch) => brandingMut.mutateAsync(patch)} saving={brandingMut.isPending} key={`branding-${b.updatedAt}`} />
          )}
          {settingsTab === "pin" && (
            <PinSection
              pin={b.pin}
              onSave={savePin}
              saving={pinMut.isPending}
              error={pinFieldError}
              key={`pin-${b.updatedAt}`}
            />
          )}
          {settingsTab === "account" && <AccountSection />}
        </>
      )}
    </div>
  );

  /* ---------- QR ---------- */
  const QrCode = (
    <div className="lol-page-pad" style={{ padding: 32, display: "flex", flexDirection: "column", gap: 28, maxWidth: 560 }}>
      <SectionHeader eyebrow="QR Code" title="Scan to get stamps" />
      {qr?.qrCodeDataUrl ? (
        <>
          <Card pad={24} style={{ textAlign: "center" }}>
            <img src={qr.qrCodeDataUrl} alt="QR Code" style={{ width: 240, height: 240, margin: "0 auto", borderRadius: 12 }} />
            <div style={{ font: "var(--type-body-sm)", color: "var(--text-muted)", marginTop: 16, wordBreak: "break-all" }}>{qr.link}</div>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 20 }}>
              <Button
                variant="secondary"
                size="sm"
                icon={<Icon name="copy" size={16} />}
                onClick={() => navigator.clipboard?.writeText(qr.link)}
              >
                Copy link
              </Button>
              <Button
                variant="primary"
                size="sm"
                icon={<Icon name="download" size={16} />}
                onClick={() => api.download("/business/me/qr/download", `${b.slug || "loyalty"}-qr.png`)}
              >
                Download PNG
              </Button>
            </div>
          </Card>
          <Card tone="sunk" pad={20} elevation={0}>
            <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <Icon name="nfc" size={18} color="var(--sky-500)" />
              <div>
                <div style={{ font: "600 14px/1.4 var(--font-body)", color: "var(--text-strong)" }}>Same link for NFC and QR</div>
                <div style={{ font: "var(--type-body-sm)", color: "var(--text-muted)", marginTop: 4 }}>
                  Program this link onto the NFC tag at the counter. The QR code above opens the same page for phones without NFC —
                  print it on a table poster or tent card.
                </div>
              </div>
            </div>
          </Card>
        </>
      ) : (
        <div style={{ padding: 40, textAlign: "center", color: "var(--text-muted)" }}>Loading QR code...</div>
      )}
    </div>
  );

  const content = tab === "dashboard" ? Dashboard : tab === "milestones" ? Milestones : tab === "customers" ? Customers : tab === "qr" ? QrCode : Settings;

  return (
    <div className="lol-app-shell" style={{ display: "flex", height: "100vh", background: "var(--surface-page)" }}>
      {Sidebar}
      <main className="lol-app-main" style={{ flex: 1, overflowY: "auto", maxWidth: "var(--width-panel)" }}>{content}</main>

      <Dialog
        open={showLogoutConfirm}
        title="Log out?"
        onClose={() => setShowLogoutConfirm(false)}
        width={380}
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setShowLogoutConfirm(false)}>Cancel</Button>
            <Button variant="danger" size="sm" onClick={handleLogout}>Log out</Button>
          </>
        }
      >
        You&apos;ll need to sign in again to manage {b.name || "your business"}.
      </Dialog>
    </div>
  );
}
