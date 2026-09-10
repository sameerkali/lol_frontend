"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../lib/auth";
import { useBusinessMe, useBusinessDashboard, useBusinessCustomers, useUpdateBusinessSettings, useUpdateBusinessPin, useBusinessQr } from "../lib/queries";
import { Button } from "../components/core/Button";
import { Card } from "../components/core/Card";
import { Badge } from "../components/core/Badge";
import { Icon } from "../components/core/Icon";
import { Input } from "../components/forms/Input";
import { StatTile } from "../components/loyalty/StatTile";
import { MilestoneLadder } from "../components/loyalty/MilestoneLadder";
import { SideNav } from "../components/navigation/SideNav";

function PinInputs({ pinMut }: { pinMut: any }) {
  const [currentPin, setCurrentPin] = React.useState("");
  const [newPin, setNewPin] = React.useState("");
  return (
    <>
      <Input label="Current PIN" type="password" mono placeholder="Enter current PIN" value={currentPin} onChange={setCurrentPin} />
      <Input label="New PIN" type="password" mono placeholder="Enter new PIN" value={newPin} onChange={setNewPin} />
      <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
        <Button variant="primary" size="sm" onClick={() => { if (newPin) pinMut.mutate({ pin: newPin, currentPin: currentPin || undefined }); }} disabled={pinMut.isPending || !newPin}>
          {pinMut.isPending ? "Updating..." : "Update PIN"}
        </Button>
      </div>
      {pinMut.isError && <div style={{ font: "600 14px/1.4 var(--font-body)", color: "var(--danger-ink)" }}>{(pinMut.error as any)?.message}</div>}
      {pinMut.isSuccess && <div style={{ font: "600 14px/1.4 var(--font-body)", color: "var(--success-ink)" }}>PIN updated.</div>}
    </>
  );
}

const NAV = [
  { value: "dashboard", label: "Dashboard", icon: "layout-dashboard" },
  { value: "milestones", label: "Milestones", icon: "flag" },
  { value: "customers", label: "Customers", icon: "users" },
  { value: "settings", label: "Settings", icon: "settings" },
  { value: "qr", label: "QR Code", icon: "qr-code" },
];

export default function BusinessPanel() {
  const router = useRouter();
  const { user, logout, loading: authLoading } = useAuth();
  const [tab, setTab] = React.useState("dashboard");
  const [settingsTab, setSettingsTab] = React.useState<"general" | "milestones" | "pin">("general");

  React.useEffect(() => {
    if (!authLoading && !user) router.replace("/business/login");
  }, [user, authLoading, router]);

  const { data: me, isLoading: meLoading } = useBusinessMe();
  const { data: dash } = useBusinessDashboard();
  const { data: custData, isLoading: custLoading } = useBusinessCustomers();
  const { data: qr } = useBusinessQr();
  const updateMut = useUpdateBusinessSettings();
  const pinMut = useUpdateBusinessPin();

  const handleLogout = () => { logout(); router.replace("/business/login"); };

  if (authLoading || !user) return null;

  const b = me || {};
  const milestones = b.milestones || [];
  const customers = custData?.customers || custData || [];
  const list = Array.isArray(customers) ? customers : [];

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
          <button onClick={handleLogout} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", background: "var(--ink-700)", border: "3px solid var(--ink-500)", borderRadius: "var(--radius-pill)", color: "var(--ink-300)", font: "var(--type-button)", cursor: "pointer", marginTop: 4 }}>
            <Icon name="log-out" size={16} /> Logout
          </button>
        </div>
      }
    />
  );

  /* ---------- Dashboard ---------- */
  const Dashboard = (
    <div style={{ padding: 32, display: "flex", flexDirection: "column", gap: 28 }}>
      <div>
        <div style={{ font: "var(--type-label)", letterSpacing: "var(--tracking-label)", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 8 }}>Dashboard</div>
        <h1 style={{ margin: 0, font: "var(--type-title)", letterSpacing: "var(--tracking-display)", color: "var(--text-strong)" }}>{b.name || "..."}</h1>
      </div>
      {dash && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
          <StatTile label="Total customers" value={dash.totalCustomers ?? list.length} icon="users" tone="grape" />
          <StatTile label="Visits (30d)" value={dash.visits?.length ?? 0} icon="stamp" tone="mint" />
          <StatTile label="Redemptions" value={dash.redemptions ?? 0} icon="gift" tone="sun" />
          <StatTile label="Repeat rate" value={dash.repeatVisitRate ? `${Math.round(dash.repeatVisitRate)}%` : "—"} icon="trending-up" tone="sky" />
        </div>
      )}
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
                  <div style={{ font: "var(--type-body-sm)", color: "var(--text-muted)" }}>{c.totalVisits ?? c.visits ?? 0} visits</div>
                </div>
                <Badge tone={c.tier === "Gold" ? "reward" : "neutral"} size="sm">{c.tier || "—"}</Badge>
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
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ font: "var(--type-label)", letterSpacing: "var(--tracking-label)", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 8 }}>Milestones</div>
          <h1 style={{ margin: 0, font: "var(--type-title)", letterSpacing: "var(--tracking-display)", color: "var(--text-strong)" }}>Reward ladder</h1>
        </div>
      </div>
      <Card pad={24}>
        {milestones.length > 0 ? (
          <MilestoneLadder milestones={milestones.map((m: any) => ({ count: m.count, label: m.label }))} current={0} />
        ) : (
          <div style={{ padding: 40, textAlign: "center", color: "var(--text-muted)" }}>No milestones configured yet.</div>
        )}
      </Card>
    </div>
  );

  /* ---------- Customers ---------- */
  const Customers = (
    <div style={{ padding: 32, display: "flex", flexDirection: "column", gap: 20 }}>
      <div>
        <div style={{ font: "var(--type-label)", letterSpacing: "var(--tracking-label)", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 8 }}>Customers</div>
        <h1 style={{ margin: 0, font: "var(--type-title)", letterSpacing: "var(--tracking-display)", color: "var(--text-strong)" }}>All customers</h1>
      </div>
      {custLoading ? <div style={{ padding: 40, textAlign: "center", color: "var(--text-muted)" }}>Loading...</div> : (
        <Card pad={0} elevation={1}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1.5fr 1fr 1fr 1fr", padding: "14px 20px", borderBottom: "var(--border)", background: "var(--paper-200)" }}>
            {["Name", "Phone", "Visits", "Tier", "Last visit"].map((h) => (
              <span key={h} style={{ font: "var(--type-label)", letterSpacing: "var(--tracking-label)", textTransform: "uppercase", color: "var(--text-muted)" }}>{h}</span>
            ))}
          </div>
          {list.map((c: any, i: number) => (
            <div key={c._id || i} style={{ display: "grid", gridTemplateColumns: "2fr 1.5fr 1fr 1fr 1fr", padding: "16px 20px", borderBottom: i < list.length - 1 ? "var(--border-hair)" : "none", alignItems: "center" }}>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <span style={{ width: 34, height: 34, display: "grid", placeItems: "center", background: "var(--grape-100)", border: "var(--border-hair)", borderRadius: "50%", font: "700 13px/1 var(--font-body)", color: "var(--grape-700)" }}>
                  {(c.name || c.phone || "?").charAt(0)}
                </span>
                <span style={{ font: "600 14px/1.3 var(--font-body)", color: "var(--text-strong)" }}>{c.name || "—"}</span>
              </div>
              <span style={{ font: "var(--type-mono)", color: "var(--text-body)", fontSize: 13 }}>{c.phone}</span>
              <span style={{ font: "700 15px/1 var(--font-mono)", color: "var(--text-strong)" }}>{c.totalVisits ?? 0}</span>
              <Badge tone={c.tier === "Gold" ? "reward" : "neutral"} size="sm">{c.tier || "—"}</Badge>
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
      <div>
        <div style={{ font: "var(--type-label)", letterSpacing: "var(--tracking-label)", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 8 }}>Settings</div>
        <h1 style={{ margin: 0, font: "var(--type-title)", letterSpacing: "var(--tracking-display)", color: "var(--text-strong)" }}>Business settings</h1>
      </div>
      <div style={{ display: "flex", gap: 12 }}>
        {(["general", "milestones", "pin"] as const).map((s) => (
          <button key={s} onClick={() => setSettingsTab(s)} style={{ padding: "10px 20px", borderRadius: "var(--radius-pill)", border: settingsTab === s ? "var(--border)" : "3px solid transparent", background: settingsTab === s ? "var(--paper-000)" : "transparent", boxShadow: settingsTab === s ? "var(--pop-1)" : "none", font: "var(--type-button)", color: settingsTab === s ? "var(--text-strong)" : "var(--text-muted)", cursor: "pointer", textTransform: "capitalize" }}>{s}</button>
        ))}
      </div>
      {settingsTab === "general" && (
        <Card pad={24}>
          <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 480 }}>
            <Input label="Business name" value={b.name || ""} placeholder="Your business name" onChange={(v) => updateMut.mutate({ name: v })} />
            <Input label="Earning mode" value={b.earningMode || "visits"} placeholder="visits" onChange={(v) => updateMut.mutate({ earningMode: v })} />
            <Input label="Check-in mode" value={b.checkInMode || "pin"} placeholder="pin" onChange={(v) => updateMut.mutate({ checkInMode: v })} />
            <Input label="Stamp limit per day" value={String(b.stampLimitPerDay ?? "")} placeholder="3" onChange={(v) => updateMut.mutate({ stampLimitPerDay: Number(v) })} />
            <Input label="Lapsed after days" value={String(b.lapsedAfterDays ?? "")} placeholder="42" onChange={(v) => updateMut.mutate({ lapsedAfterDays: Number(v) })} />
            {updateMut.isPending && <div style={{ font: "var(--type-body-sm)", color: "var(--text-muted)" }}>Saving...</div>}
          </div>
        </Card>
      )}
      {settingsTab === "milestones" && (
        <Card pad={24}>
          <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 480 }}>
            <div style={{ font: "var(--type-body)", color: "var(--text-body)" }}>Edit the rewards your customers work toward.</div>
            {milestones.map((m: any, i: number) => (
              <div key={i} style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <span style={{ font: "700 15px/1 var(--font-mono)", color: "var(--text-strong)", width: 40 }}>{m.count}</span>
                <span style={{ flex: 1, font: "var(--type-body)", color: "var(--text-body)" }}>{m.label}</span>
              </div>
            ))}
            {milestones.length === 0 && <div style={{ color: "var(--text-muted)" }}>No milestones set.</div>}
          </div>
        </Card>
      )}
      {settingsTab === "pin" && (
        <Card pad={24}>
          <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 480 }}>
            <div style={{ font: "var(--type-body)", color: "var(--text-body)" }}>Change the staff PIN used to confirm visits and redeem rewards.</div>
            <PinInputs pinMut={pinMut} />
          </div>
        </Card>
      )}
    </div>
  );

  /* ---------- QR ---------- */
  const QrCode = (
    <div style={{ padding: 32, display: "flex", flexDirection: "column", gap: 28, maxWidth: 480 }}>
      <div>
        <div style={{ font: "var(--type-label)", letterSpacing: "var(--tracking-label)", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 8 }}>QR Code</div>
        <h1 style={{ margin: 0, font: "var(--type-title)", letterSpacing: "var(--tracking-display)", color: "var(--text-strong)" }}>Scan to get stamps</h1>
      </div>
      {qr?.qrCodeDataUrl ? (
        <Card pad={24} style={{ textAlign: "center" }}>
          <img src={qr.qrCodeDataUrl} alt="QR Code" style={{ width: 240, height: 240, margin: "0 auto" }} />
          <div style={{ font: "var(--type-body)", color: "var(--text-muted)", marginTop: 16 }}>{qr.link}</div>
        </Card>
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
    </div>
  );
}
