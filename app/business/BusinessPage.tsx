"use client";
import React from "react";
import { Button } from "../components/core/Button";
import { Card } from "../components/core/Card";
import { Badge } from "../components/core/Badge";
import { Icon } from "../components/core/Icon";
import { Input } from "../components/forms/Input";
import { StatTile } from "../components/loyalty/StatTile";
import { MilestoneLadder } from "../components/loyalty/MilestoneLadder";
import { SideNav } from "../components/navigation/SideNav";

const NAV_ITEMS = [
  { value: "dashboard", label: "Dashboard", icon: "layout-dashboard" },
  { value: "milestones", label: "Milestones", icon: "flag" },
  { value: "customers", label: "Customers", icon: "users" },
  { value: "settings", label: "Settings", icon: "settings" },
];

const MILESTONES = [
  { count: 5, label: "Free coffee" },
  { count: 10, label: "20% off the bill" },
  { count: 15, label: "Free dessert" },
];

const CUSTOMERS = [
  { name: "Priya S.", phone: "98765 43210", visits: 12, tier: "Silver", lastVisit: "Today" },
  { name: "Arjun K.", phone: "91234 56789", visits: 8, tier: "Bronze", lastVisit: "2 Sep" },
  { name: "Meera R.", phone: "99887 76655", visits: 15, tier: "Gold", lastVisit: "28 Aug" },
  { name: "Vikram P.", phone: "90012 34567", visits: 3, tier: "Bronze", lastVisit: "21 Aug" },
  { name: "Sneha M.", phone: "97654 32109", visits: 6, tier: "Bronze", lastVisit: "15 Aug" },
];

export default function BusinessPage() {
  const [tab, setTab] = React.useState("dashboard");
  const [settingsTab, setSettingsTab] = React.useState<"general" | "milestones" | "pin">("general");

  const Sidebar = (
    <SideNav
      items={NAV_ITEMS}
      value={tab}
      onChange={setTab}
      brand="lol"
      footer={
        <div style={{ padding: "12px 0", borderTop: "1px solid var(--ink-700)" }}>
          <div style={{ font: "var(--type-body-sm)", color: "var(--ink-300)" }}>Kaapi House</div>
          <div style={{ font: "var(--type-mono)", color: "var(--ink-500)", fontSize: 11 }}>admin@kaapihouse.in</div>
        </div>
      }
    />
  );

  /* ---------- Dashboard ---------- */
  const Dashboard = (
    <div style={{ padding: 32, display: "flex", flexDirection: "column", gap: 28 }}>
      <div>
        <div style={{ font: "var(--type-label)", letterSpacing: "var(--tracking-label)", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 8 }}>Dashboard</div>
        <h1 style={{ margin: 0, font: "var(--type-title)", letterSpacing: "var(--tracking-display)", color: "var(--text-strong)" }}>Kaapi House</h1>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
        <StatTile label="Total customers" value="142" delta="+12 this week" icon="users" tone="grape" />
        <StatTile label="Visits this week" value="89" delta="+8%" icon="stamp" tone="mint" />
        <StatTile label="Rewards redeemed" value="23" delta="+3" icon="gift" tone="sun" />
        <StatTile label="Active cards" value="67" icon="credit-card" tone="sky" />
      </div>

      <Card pad={24}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div style={{ font: "var(--type-subtitle)", letterSpacing: "var(--tracking-display)", color: "var(--text-strong)" }}>Recent activity</div>
          <Badge tone="info" size="sm">Live</Badge>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {CUSTOMERS.slice(0, 4).map((c, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                gap: 14,
                alignItems: "center",
                padding: "14px 0",
                borderBottom: i < 3 ? "var(--border-hair)" : "none",
              }}
            >
              <span
                style={{
                  width: 40,
                  height: 40,
                  display: "grid",
                  placeItems: "center",
                  background: "var(--grape-100)",
                  border: "var(--border-hair)",
                  borderRadius: "50%",
                  font: "700 14px/1 var(--font-body)",
                  color: "var(--grape-700)",
                }}
              >
                {c.name.charAt(0)}
              </span>
              <div style={{ flex: 1 }}>
                <div style={{ font: "600 15px/1.3 var(--font-body)", color: "var(--text-strong)" }}>{c.name}</div>
                <div style={{ font: "var(--type-body-sm)", color: "var(--text-muted)" }}>{c.visits} visits</div>
              </div>
              <Badge tone={c.tier === "Gold" ? "reward" : c.tier === "Silver" ? "neutral" : "neutral"} size="sm">
                {c.tier}
              </Badge>
              <span style={{ font: "var(--type-mono)", color: "var(--text-muted)", fontSize: 12 }}>{c.lastVisit}</span>
            </div>
          ))}
        </div>
      </Card>
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
        <Button variant="primary" size="sm" icon={<Icon name="plus" size={16} />}>Add milestone</Button>
      </div>

      <Card pad={24}>
        <MilestoneLadder milestones={MILESTONES} current={12} />
      </Card>

      <Card tone="sunk" pad={20} elevation={0}>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <Icon name="info" size={18} color="var(--sky-500)" />
          <div style={{ font: "var(--type-body)", color: "var(--text-body)" }}>
            Customers see this ladder on their card. Milestones apply to all customers equally.
          </div>
        </div>
      </Card>
    </div>
  );

  /* ---------- Customers ---------- */
  const Customers = (
    <div style={{ padding: 32, display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ font: "var(--type-label)", letterSpacing: "var(--tracking-label)", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 8 }}>Customers</div>
          <h1 style={{ margin: 0, font: "var(--type-title)", letterSpacing: "var(--tracking-display)", color: "var(--text-strong)" }}>All customers</h1>
        </div>
        <Input placeholder="Search by name or phone..." icon="search" style={{ width: 280 }} />
      </div>

      <Card pad={0} elevation={1}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1.5fr 1fr 1fr 1fr",
            padding: "14px 20px",
            borderBottom: "var(--border)",
            background: "var(--paper-200)",
          }}
        >
          {["Name", "Phone", "Visits", "Tier", "Last visit"].map((h) => (
            <span key={h} style={{ font: "var(--type-label)", letterSpacing: "var(--tracking-label)", textTransform: "uppercase", color: "var(--text-muted)" }}>
              {h}
            </span>
          ))}
        </div>
        {CUSTOMERS.map((c, i) => (
          <div
            key={i}
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 1.5fr 1fr 1fr 1fr",
              padding: "16px 20px",
              borderBottom: i < CUSTOMERS.length - 1 ? "var(--border-hair)" : "none",
              alignItems: "center",
              transition: "background var(--dur-fast) var(--ease-out)",
            }}
          >
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <span
                style={{
                  width: 34,
                  height: 34,
                  display: "grid",
                  placeItems: "center",
                  background: "var(--grape-100)",
                  border: "var(--border-hair)",
                  borderRadius: "50%",
                  font: "700 13px/1 var(--font-body)",
                  color: "var(--grape-700)",
                }}
              >
                {c.name.charAt(0)}
              </span>
              <span style={{ font: "600 14px/1.3 var(--font-body)", color: "var(--text-strong)" }}>{c.name}</span>
            </div>
            <span style={{ font: "var(--type-mono)", color: "var(--text-body)", fontSize: 13 }}>{c.phone}</span>
            <span style={{ font: "700 15px/1 var(--font-mono)", color: "var(--text-strong)" }}>{c.visits}</span>
            <Badge tone={c.tier === "Gold" ? "reward" : "neutral"} size="sm">{c.tier}</Badge>
            <span style={{ font: "var(--type-body-sm)", color: "var(--text-muted)" }}>{c.lastVisit}</span>
          </div>
        ))}
      </Card>
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
          <button
            key={s}
            onClick={() => setSettingsTab(s)}
            style={{
              padding: "10px 20px",
              borderRadius: "var(--radius-pill)",
              border: settingsTab === s ? "var(--border)" : "3px solid transparent",
              background: settingsTab === s ? "var(--paper-000)" : "transparent",
              boxShadow: settingsTab === s ? "var(--pop-1)" : "none",
              font: "var(--type-button)",
              color: settingsTab === s ? "var(--text-strong)" : "var(--text-muted)",
              cursor: "pointer",
              textTransform: "capitalize",
            }}
          >
            {s}
          </button>
        ))}
      </div>

      {settingsTab === "general" && (
        <Card pad={24}>
          <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 480 }}>
            <Input label="Business name" value="Kaapi House" placeholder="Your business name" />
            <Input label="Location" value="Indiranagar, Bengaluru" placeholder="Area, City" />
            <Input label="Contact phone" value="98765 43210" icon="phone" mono placeholder="98765 43210" />
            <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
              <Button variant="primary" size="sm">Save changes</Button>
              <Button variant="ghost" size="sm">Cancel</Button>
            </div>
          </div>
        </Card>
      )}

      {settingsTab === "milestones" && (
        <Card pad={24}>
          <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 480 }}>
            <div style={{ font: "var(--type-body)", color: "var(--text-body)" }}>
              Edit the rewards your customers work toward. Changes apply to all customers immediately.
            </div>
            {MILESTONES.map((m, i) => (
              <div key={i} style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <Input value={String(m.count)} style={{ width: 80 }} mono />
                <Input value={m.label} style={{ flex: 1 }} />
                <button
                  style={{
                    width: 36,
                    height: 36,
                    display: "grid",
                    placeItems: "center",
                    background: "var(--coral-100)",
                    border: "var(--border-hair)",
                    borderRadius: "var(--radius-sm)",
                    cursor: "pointer",
                    color: "var(--coral-700)",
                  }}
                >
                  <Icon name="trash-2" size={16} />
                </button>
              </div>
            ))}
            <Button variant="secondary" size="sm" icon={<Icon name="plus" size={16} />}>Add milestone</Button>
          </div>
        </Card>
      )}

      {settingsTab === "pin" && (
        <Card pad={24}>
          <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 480 }}>
            <div style={{ font: "var(--type-body)", color: "var(--text-body)" }}>
              The staff PIN is used to confirm visits and redeem rewards. Change it regularly.
            </div>
            <Input label="Current PIN" type="password" mono placeholder="Enter current PIN" />
            <Input label="New PIN" type="password" mono placeholder="Enter new 4-digit PIN" />
            <Input label="Confirm new PIN" type="password" mono placeholder="Re-enter new PIN" />
            <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
              <Button variant="primary" size="sm">Update PIN</Button>
              <Button variant="ghost" size="sm">Cancel</Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );

  const content =
    tab === "dashboard"
      ? Dashboard
      : tab === "milestones"
        ? Milestones
        : tab === "customers"
          ? Customers
          : Settings;

  return (
    <div style={{ display: "flex", height: "100vh", background: "var(--surface-page)" }}>
      {Sidebar}
      <main style={{ flex: 1, overflowY: "auto", maxWidth: "var(--width-panel)" }}>
        {content}
      </main>
    </div>
  );
}
