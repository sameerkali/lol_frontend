"use client";
import React from "react";
import { Button } from "../components/core/Button";
import { Card } from "../components/core/Card";
import { Badge } from "../components/core/Badge";
import { Icon } from "../components/core/Icon";
import { Input } from "../components/forms/Input";
import { Dialog } from "../components/feedback/Dialog";
import { SideNav } from "../components/navigation/SideNav";

const NAV_ITEMS = [
  { value: "businesses", label: "Businesses", icon: "store" },
  { value: "create", label: "Create business", icon: "plus-circle" },
];

const BUSINESSES = [
  { name: "Kaapi House", location: "Bengaluru", customers: 142, status: "active", created: "15 Jul 2026" },
  { name: "Chai Point", location: "Mumbai", customers: 89, status: "active", created: "22 Jul 2026" },
  { name: "Blue Tokai", location: "Delhi", customers: 234, status: "active", created: "1 Aug 2026" },
  { name: "Third Wave Coffee", location: "Pune", customers: 67, status: "active", created: "10 Aug 2026" },
  { name: "Starbucks Reserve", location: "Mumbai", customers: 312, status: "suspended", created: "5 Jul 2026" },
];

export default function AdminPage() {
  const [tab, setTab] = React.useState("businesses");
  const [showCreate, setShowCreate] = React.useState(false);

  const Sidebar = (
    <SideNav
      items={NAV_ITEMS}
      value={tab}
      onChange={setTab}
      brand="lol"
      footer={
        <div style={{ padding: "12px 0", borderTop: "1px solid var(--ink-700)" }}>
          <div style={{ font: "var(--type-body-sm)", color: "var(--ink-300)" }}>Expendifii Admin</div>
          <div style={{ font: "var(--type-mono)", color: "var(--ink-500)", fontSize: 11 }}>admin@expendifii.com</div>
        </div>
      }
    />
  );

  /* ---------- Business list ---------- */
  const BusinessList = (
    <div style={{ padding: 32, display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ font: "var(--type-label)", letterSpacing: "var(--tracking-label)", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 8 }}>Admin</div>
          <h1 style={{ margin: 0, font: "var(--type-title)", letterSpacing: "var(--tracking-display)", color: "var(--text-strong)" }}>Businesses</h1>
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <Input placeholder="Search..." icon="search" style={{ width: 240 }} />
          <Button variant="primary" size="sm" icon={<Icon name="plus" size={16} />} onClick={() => setShowCreate(true)}>
            New business
          </Button>
        </div>
      </div>

      <div style={{ display: "flex", gap: 16, marginBottom: 8 }}>
        <Card tone="grape" pad={16} elevation={1} style={{ flex: 1 }}>
          <div style={{ font: "var(--type-label)", letterSpacing: "var(--tracking-label)", textTransform: "uppercase", color: "var(--grape-700)" }}>Total businesses</div>
          <div style={{ font: "700 36px/1 var(--font-mono)", color: "var(--text-strong)", marginTop: 8 }}>{BUSINESSES.length}</div>
        </Card>
        <Card tone="mint" pad={16} elevation={1} style={{ flex: 1 }}>
          <div style={{ font: "var(--type-label)", letterSpacing: "var(--tracking-label)", textTransform: "uppercase", color: "var(--mint-700)" }}>Active</div>
          <div style={{ font: "700 36px/1 var(--font-mono)", color: "var(--text-strong)", marginTop: 8 }}>{BUSINESSES.filter((b) => b.status === "active").length}</div>
        </Card>
        <Card tone="sun" pad={16} elevation={1} style={{ flex: 1 }}>
          <div style={{ font: "var(--type-label)", letterSpacing: "var(--tracking-label)", textTransform: "uppercase", color: "var(--sun-700)" }}>Total customers</div>
          <div style={{ font: "700 36px/1 var(--font-mono)", color: "var(--text-strong)", marginTop: 8 }}>{BUSINESSES.reduce((s, b) => s + b.customers, 0)}</div>
        </Card>
      </div>

      <Card pad={0} elevation={1}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1.5fr 1fr 1fr 1.5fr",
            padding: "14px 20px",
            borderBottom: "var(--border)",
            background: "var(--paper-200)",
          }}
        >
          {["Business", "Location", "Customers", "Status", "Created"].map((h) => (
            <span key={h} style={{ font: "var(--type-label)", letterSpacing: "var(--tracking-label)", textTransform: "uppercase", color: "var(--text-muted)" }}>
              {h}
            </span>
          ))}
        </div>
        {BUSINESSES.map((b, i) => (
          <div
            key={i}
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 1.5fr 1fr 1fr 1.5fr",
              padding: "16px 20px",
              borderBottom: i < BUSINESSES.length - 1 ? "var(--border-hair)" : "none",
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
                {b.name.charAt(0)}
              </span>
              <span style={{ font: "600 14px/1.3 var(--font-body)", color: "var(--text-strong)" }}>{b.name}</span>
            </div>
            <span style={{ font: "var(--type-body)", color: "var(--text-body)" }}>{b.location}</span>
            <span style={{ font: "700 15px/1 var(--font-mono)", color: "var(--text-strong)" }}>{b.customers}</span>
            <Badge tone={b.status === "active" ? "success" : "danger"} size="sm">{b.status}</Badge>
            <span style={{ font: "var(--type-body-sm)", color: "var(--text-muted)" }}>{b.created}</span>
          </div>
        ))}
      </Card>
    </div>
  );

  /* ---------- Create business ---------- */
  const CreateBusiness = (
    <div style={{ padding: 32, display: "flex", flexDirection: "column", gap: 28, maxWidth: 640 }}>
      <div>
        <div style={{ font: "var(--type-label)", letterSpacing: "var(--tracking-label)", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 8 }}>Admin</div>
        <h1 style={{ margin: 0, font: "var(--type-title)", letterSpacing: "var(--tracking-display)", color: "var(--text-strong)" }}>Create business</h1>
      </div>

      <Card pad={24}>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <Input label="Business name" placeholder="e.g. Kaapi House" icon="store" />
          <Input label="Location" placeholder="City, State" icon="map-pin" />
          <Input label="Contact email" placeholder="hello@business.com" icon="mail" type="email" />
          <Input label="Contact phone" placeholder="98765 43210" icon="phone" mono />

          <div style={{ marginTop: 8, display: "flex", gap: 12 }}>
            <Button variant="primary" size="md">Create business</Button>
            <Button variant="ghost" size="md" onClick={() => setTab("businesses")}>Cancel</Button>
          </div>
        </div>
      </Card>
    </div>
  );

  const content = tab === "businesses" ? BusinessList : CreateBusiness;

  return (
    <div style={{ display: "flex", height: "100vh", background: "var(--surface-page)" }}>
      {Sidebar}
      <main style={{ flex: 1, overflowY: "auto", maxWidth: "var(--width-panel)" }}>
        {content}
      </main>

      <Dialog open={showCreate} title="Create new business" onClose={() => setShowCreate(false)} width={480}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Input label="Business name" placeholder="e.g. Kaapi House" />
          <Input label="Location" placeholder="City, State" />
          <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
            <Button variant="primary" size="sm" onClick={() => { setShowCreate(false); setTab("create"); }}>Continue</Button>
            <Button variant="ghost" size="sm" onClick={() => setShowCreate(false)}>Cancel</Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
