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
import { Badge } from "../components/core/Badge";
import { Icon } from "../components/core/Icon";
import { Input } from "../components/forms/Input";
import { Select } from "../components/forms/Select";
import { StatTile } from "../components/loyalty/StatTile";
import { SideNav } from "../components/navigation/SideNav";
import { Dialog } from "../components/feedback/Dialog";
import { splitFieldErrors } from "../lib/validation";
import {
  EarningSection,
  MilestonesSection,
  SignupRewardsSection,
  BrandingSection,
  PinSection,
} from "./SettingsPanel";

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

function SectionHeader({ eyebrow, title, action }: { eyebrow: string; title: string; action?: React.ReactNode }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16 }}>
      <div>
        <div style={{ font: "var(--type-label)", letterSpacing: "var(--tracking-label)", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 8 }}>
          {eyebrow}
        </div>
        <h1 style={{ margin: 0, font: "var(--type-title)", letterSpacing: "var(--tracking-display)", color: "var(--text-strong)" }}>{title}</h1>
      </div>
      {action}
    </div>
  );
}

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

  const [customerSearch, setCustomerSearch] = React.useState("");
  const [customerSort, setCustomerSort] = React.useState("newest");
  const [onlyUnredeemed, setOnlyUnredeemed] = React.useState(false);

  React.useEffect(() => {
    if (!authLoading && !user) router.replace("/business/login");
  }, [user, authLoading, router]);

  const { data: me, isLoading: meLoading } = useBusinessMe();
  const { data: dash } = useBusinessDashboard();
  const customerParams = React.useMemo(() => {
    const p: Record<string, string> = { sort: customerSort };
    if (customerSearch.trim()) p.phone = customerSearch.trim();
    if (onlyUnredeemed) p.hasUnredeemedRewards = "true";
    return p;
  }, [customerSearch, customerSort, onlyUnredeemed]);
  const { data: custData, isLoading: custLoading } = useBusinessCustomers(customerParams);
  const { data: qr } = useBusinessQr();

  const updateMut = useUpdateBusinessSettings();
  const pinMut = useUpdateBusinessPin();
  const brandingMut = useUpdateBusinessBranding();

  const handleLogout = () => { logout(); router.replace("/business/login"); };

  if (authLoading || !user) return null;

  const b = me || {};
  const milestones = b.milestones || [];
  const customers = custData?.customers || custData || [];
  const list = Array.isArray(customers) ? customers : [];

  const savePin = async (pin: string, currentPin?: string) => {
    await pinMut.mutateAsync({ pin, currentPin });
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
    <div style={{ padding: 32, display: "flex", flexDirection: "column", gap: 28 }}>
      <SectionHeader eyebrow="Dashboard" title={b.name || "..."} />
      {dash && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
          <StatTile label="Total customers" value={dash.totalCustomers ?? list.length} icon="users" tone="grape" />
          <StatTile label="Visits (30d)" value={dash.visits ?? 0} icon="stamp" tone="mint" />
          <StatTile label="Redemptions (30d)" value={dash.redemptions ?? 0} icon="gift" tone="sun" />
          <StatTile label="Repeat visit rate" value={dash.repeatVisitRate != null ? `${dash.repeatVisitRate}%` : "—"} icon="trending-up" tone="sky" />
        </div>
      )}

      <Card pad={20}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <span style={{ width: 44, height: 44, display: "grid", placeItems: "center", background: "var(--surface-sunk)", borderRadius: "var(--radius-md)", border: "var(--border-hair)" }}>
              <Icon name="key" size={20} color="var(--ink-500)" />
            </span>
            <div>
              <div style={{ font: "var(--type-label)", letterSpacing: "var(--tracking-label)", textTransform: "uppercase", color: "var(--text-muted)" }}>Business PIN</div>
              <div style={{ font: "700 26px/1 var(--font-mono)", letterSpacing: "0.1em", color: "var(--text-strong)", marginTop: 4 }}>
                {meLoading ? "—" : b.pin ? (pinRevealDash ? b.pin : "••••") : "Not set"}
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {b.pin && (
              <Button variant="ghost" size="sm" icon={<Icon name={pinRevealDash ? "eye-off" : "eye"} size={16} />} onClick={() => setPinRevealDash((v) => !v)}>
                {pinRevealDash ? "Hide" : "Show"}
              </Button>
            )}
            <Button variant="secondary" size="sm" icon={<Icon name="pencil" size={16} />} onClick={() => { setTab("settings"); setSettingsTab("pin"); }}>
              Change
            </Button>
          </div>
        </div>
      </Card>

      {meLoading ? <div style={{ padding: 40, textAlign: "center", color: "var(--text-muted)" }}>Loading...</div> : (
        <Card pad={24}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <div style={{ font: "var(--type-subtitle)", letterSpacing: "var(--tracking-display)", color: "var(--text-strong)" }}>Recent customers</div>
            <Badge tone="info" size="sm">{list.length} total</Badge>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {list.slice(0, 5).map((c: any, i: number) => (
              <div key={c._id || i} style={{ display: "flex", gap: 14, alignItems: "center", padding: "14px 0", borderBottom: i < Math.min(list.length, 5) - 1 ? "var(--border-hair)" : "none" }}>
                <span style={{ width: 40, height: 40, display: "grid", placeItems: "center", background: "var(--grape-100)", border: "var(--border-hair)", borderRadius: "50%", font: "700 14px/1 var(--font-body)", color: "var(--grape-700)" }}>
                  {(c.name || c.phone || "?").charAt(0)}
                </span>
                <div style={{ flex: 1 }}>
                  <div style={{ font: "600 15px/1.3 var(--font-body)", color: "var(--text-strong)" }}>{c.name || c.phone}</div>
                  <div style={{ font: "var(--type-body-sm)", color: "var(--text-muted)" }}>{c.totalVisits ?? 0} visits · {c.totalPoints ?? 0} points</div>
                </div>
                <Badge tone={c.ruleSnapshot?.tierName ? "reward" : "neutral"} size="sm">{c.ruleSnapshot?.tierName || "—"}</Badge>
              </div>
            ))}
            {list.length === 0 && <div style={{ padding: 20, textAlign: "center", color: "var(--text-muted)" }}>No customers yet.</div>}
          </div>
        </Card>
      )}
    </div>
  );

  /* ---------- Milestones ---------- */
  const Milestones = (
    <div style={{ padding: 32, display: "flex", flexDirection: "column", gap: 28 }}>
      <SectionHeader eyebrow="Milestones" title="Reward ladder" />
      {meLoading ? (
        <div style={{ padding: 40, textAlign: "center", color: "var(--text-muted)" }}>Loading...</div>
      ) : (
        <MilestonesSection business={b} onSave={(patch) => updateMut.mutateAsync(patch)} saving={updateMut.isPending} key={b.updatedAt} />
      )}
    </div>
  );

  /* ---------- Customers ---------- */
  const Customers = (
    <div style={{ padding: 32, display: "flex", flexDirection: "column", gap: 20 }}>
      <SectionHeader
        eyebrow="Customers"
        title="All customers"
        action={
          <Button
            variant="secondary"
            size="sm"
            icon={<Icon name="download" size={16} />}
            onClick={() => api.download(`/business/customers/export?${new URLSearchParams(customerParams).toString()}`, "customers.csv")}
          >
            Export CSV
          </Button>
        }
      />
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
        <Input placeholder="Search by phone..." icon="search" value={customerSearch} onChange={setCustomerSearch} style={{ width: 240 }} />
        <Select value={customerSort} onChange={setCustomerSort} options={[
          { value: "newest", label: "Newest first" },
          { value: "visits", label: "Most visits" },
          { value: "lastVisit", label: "Last visit" },
        ]} style={{ width: 190 }} />
        <label style={{ display: "flex", alignItems: "center", gap: 8, font: "var(--type-body-sm)", color: "var(--text-body)", cursor: "pointer" }}>
          <input type="checkbox" checked={onlyUnredeemed} onChange={(e) => setOnlyUnredeemed(e.target.checked)} />
          Unredeemed rewards only
        </label>
      </div>
      {custLoading ? <div style={{ padding: 40, textAlign: "center", color: "var(--text-muted)" }}>Loading...</div> : (
        <Card pad={0} elevation={1}>
          <div style={{ display: "grid", gridTemplateColumns: "1.8fr 1.3fr 0.8fr 0.8fr 1fr 1fr", padding: "14px 20px", borderBottom: "var(--border)", background: "var(--paper-200)" }}>
            {["Name", "Phone", "Visits", "Points", "Tier", "Last visit"].map((h) => (
              <span key={h} style={{ font: "var(--type-label)", letterSpacing: "var(--tracking-label)", textTransform: "uppercase", color: "var(--text-muted)" }}>{h}</span>
            ))}
          </div>
          {list.map((c: any, i: number) => (
            <div key={c._id || i} style={{ display: "grid", gridTemplateColumns: "1.8fr 1.3fr 0.8fr 0.8fr 1fr 1fr", padding: "16px 20px", borderBottom: i < list.length - 1 ? "var(--border-hair)" : "none", alignItems: "center" }}>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <span style={{ width: 34, height: 34, display: "grid", placeItems: "center", background: "var(--grape-100)", border: "var(--border-hair)", borderRadius: "50%", font: "700 13px/1 var(--font-body)", color: "var(--grape-700)" }}>
                  {(c.name || c.phone || "?").charAt(0)}
                </span>
                <span style={{ font: "600 14px/1.3 var(--font-body)", color: "var(--text-strong)" }}>{c.name || "—"}</span>
              </div>
              <span style={{ font: "var(--type-mono)", color: "var(--text-body)", fontSize: 13 }}>{c.phone}</span>
              <span style={{ font: "700 15px/1 var(--font-mono)", color: "var(--text-strong)" }}>{c.totalVisits ?? 0}</span>
              <span style={{ font: "700 15px/1 var(--font-mono)", color: "var(--text-strong)" }}>{c.totalPoints ?? 0}</span>
              <Badge tone={c.ruleSnapshot?.tierName ? "reward" : "neutral"} size="sm">{c.ruleSnapshot?.tierName || "—"}</Badge>
              <span style={{ font: "var(--type-body-sm)", color: "var(--text-muted)" }}>{c.lastVisitAt ? new Date(c.lastVisitAt).toLocaleDateString() : "—"}</span>
            </div>
          ))}
          {list.length === 0 && <div style={{ padding: 40, textAlign: "center", color: "var(--text-muted)" }}>No customers yet. Put the tag on the counter.</div>}
        </Card>
      )}
    </div>
  );

  /* ---------- Settings ---------- */
  const Settings = (
    <div style={{ padding: 32, display: "flex", flexDirection: "column", gap: 28 }}>
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
        <div style={{ padding: 40, textAlign: "center", color: "var(--text-muted)" }}>Loading...</div>
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
              hasPin={!!b.pin}
              requireCurrentPin
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
    <div style={{ padding: 32, display: "flex", flexDirection: "column", gap: 28, maxWidth: 560 }}>
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
    <div style={{ display: "flex", height: "100vh", background: "var(--surface-page)" }}>
      {Sidebar}
      <main style={{ flex: 1, overflowY: "auto", maxWidth: "var(--width-panel)" }}>{content}</main>

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
        You'll need to sign in again to manage {b.name || "your business"}.
      </Dialog>
    </div>
  );
}
