"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../lib/auth";
import { useAdminStats, useAdminBusinesses, useAdminTemplates, useCreateBusiness, useDeleteBusiness } from "../lib/queries";
import { Button } from "../components/core/Button";
import { Card } from "../components/core/Card";
import { Badge } from "../components/core/Badge";
import { Icon } from "../components/core/Icon";
import { Input } from "../components/forms/Input";
import { Dialog } from "../components/feedback/Dialog";
import { SideNav } from "../components/navigation/SideNav";
import { validateCreateBusinessForm, validatePinFormat, splitFieldErrors, type CreateBusinessFieldErrors } from "../lib/validation";

const CREATE_BUSINESS_FIELDS = ["name", "ownerEmail", "ownerPassword"] as const;
const FALLBACK_TEMPLATES = [
  { key: "cafe", label: "Café", description: "" },
  { key: "restaurant", label: "Restaurant", description: "" },
  { key: "blank", label: "Blank / custom", description: "" },
];

const NAV = [
  { value: "businesses", label: "Businesses", icon: "store" },
  { value: "create", label: "Create business", icon: "plus-circle" },
];

export default function AdminPage() {
  const router = useRouter();
  const { user, logout, loading: authLoading } = useAuth();
  const [tab, setTab] = React.useState("businesses");
  const [showCreate, setShowCreate] = React.useState(false);
  const [search, setSearch] = React.useState("");

  React.useEffect(() => {
    if (!authLoading && !user) router.replace("/admin/login");
  }, [user, authLoading, router]);

  const { data: stats } = useAdminStats();
  const { data: bizData, isLoading: bizLoading } = useAdminBusinesses(search ? { search } : undefined);
  const { data: templatesData } = useAdminTemplates();
  const templates = templatesData?.length ? templatesData : FALLBACK_TEMPLATES;
  const createMut = useCreateBusiness();
  const deleteMut = useDeleteBusiness();

  const [newName, setNewName] = React.useState("");
  const [newEmail, setNewEmail] = React.useState("");
  const [newPass, setNewPass] = React.useState("");
  const [newPin, setNewPin] = React.useState("");
  const [newTemplate, setNewTemplate] = React.useState("cafe");
  const [createFieldErrors, setCreateFieldErrors] = React.useState<CreateBusinessFieldErrors & { pin?: string }>({});
  const [createFormError, setCreateFormError] = React.useState("");

  const handleCreate = async () => {
    setCreateFormError("");
    const errors: CreateBusinessFieldErrors & { pin?: string } = validateCreateBusinessForm(newName, newEmail, newPass);
    if (newPin) {
      const pinError = validatePinFormat(newPin);
      if (pinError) errors.pin = pinError;
    }
    setCreateFieldErrors(errors);
    if (Object.keys(errors).length) return;

    try {
      await createMut.mutateAsync({ name: newName, template: newTemplate, ownerEmail: newEmail.trim(), ownerPassword: newPass, pin: newPin || undefined });
      setShowCreate(false);
      setNewName(""); setNewEmail(""); setNewPass(""); setNewPin("");
      setCreateFieldErrors({});
      setTab("businesses");
    } catch (e: any) {
      const { fields, general } = splitFieldErrors(e.details, CREATE_BUSINESS_FIELDS);
      setCreateFieldErrors(fields);
      if (general.length) setCreateFormError(general.join(" "));
      else if (!Object.keys(fields).length) setCreateFormError(e.message || "Failed to create business");
    }
  };

  const handleLogout = () => { logout(); router.replace("/admin/login"); };

  if (authLoading || !user) return null;

  const businesses = bizData?.businesses || bizData || [];
  const list = Array.isArray(businesses) ? businesses : [];
  const totalCustomers = list.reduce((s: number, b: any) => s + (b.customerCount || b.customers?.length || 0), 0);

  const Sidebar = (
    <SideNav
      items={NAV}
      value={tab}
      onChange={setTab}
      brand="lol"
      footer={
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ font: "var(--type-body-sm)", color: "var(--ink-300)" }}>{user.name || user.email}</div>
          <button onClick={handleLogout} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", background: "var(--ink-700)", border: "3px solid var(--ink-500)", borderRadius: "var(--radius-pill)", color: "var(--ink-300)", font: "var(--type-button)", cursor: "pointer" }}>
            <Icon name="log-out" size={16} /> Logout
          </button>
        </div>
      }
    />
  );

  const BusinessList = (
    <div style={{ padding: 32, display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ font: "var(--type-label)", letterSpacing: "var(--tracking-label)", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 8 }}>Admin</div>
          <h1 style={{ margin: 0, font: "var(--type-title)", letterSpacing: "var(--tracking-display)", color: "var(--text-strong)" }}>Businesses</h1>
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <Input placeholder="Search..." icon="search" style={{ width: 240 }} value={search} onChange={setSearch} />
          <Button variant="primary" size="sm" icon={<Icon name="plus" size={16} />} onClick={() => setShowCreate(true)}>New business</Button>
        </div>
      </div>

      {stats && (
        <div style={{ display: "flex", gap: 16, marginBottom: 8 }}>
          <Card tone="grape" pad={16} elevation={1} style={{ flex: 1 }}>
            <div style={{ font: "var(--type-label)", letterSpacing: "var(--tracking-label)", textTransform: "uppercase", color: "var(--grape-700)" }}>Businesses</div>
            <div style={{ font: "700 36px/1 var(--font-mono)", color: "var(--text-strong)", marginTop: 8 }}>{stats.totalBusinesses ?? list.length}</div>
          </Card>
          <Card tone="mint" pad={16} elevation={1} style={{ flex: 1 }}>
            <div style={{ font: "var(--type-label)", letterSpacing: "var(--tracking-label)", textTransform: "uppercase", color: "var(--mint-700)" }}>Customers</div>
            <div style={{ font: "700 36px/1 var(--font-mono)", color: "var(--text-strong)", marginTop: 8 }}>{stats.totalCustomers ?? totalCustomers}</div>
          </Card>
          <Card tone="sun" pad={16} elevation={1} style={{ flex: 1 }}>
            <div style={{ font: "var(--type-label)", letterSpacing: "var(--tracking-label)", textTransform: "uppercase", color: "var(--sun-700)" }}>Visits</div>
            <div style={{ font: "700 36px/1 var(--font-mono)", color: "var(--text-strong)", marginTop: 8 }}>{stats.totalVisits ?? "—"}</div>
          </Card>
        </div>
      )}

      {bizLoading ? <div style={{ padding: 40, textAlign: "center", color: "var(--text-muted)" }}>Loading...</div> : (
        <Card pad={0} elevation={1}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1.5fr 1fr 1fr 1fr", padding: "14px 20px", borderBottom: "var(--border)", background: "var(--paper-200)" }}>
            {["Business", "Location", "Customers", "Status", "Actions"].map((h) => (
              <span key={h} style={{ font: "var(--type-label)", letterSpacing: "var(--tracking-label)", textTransform: "uppercase", color: "var(--text-muted)" }}>{h}</span>
            ))}
          </div>
          {list.map((b: any, i: number) => (
            <div key={b._id || b.id || i} style={{ display: "grid", gridTemplateColumns: "2fr 1.5fr 1fr 1fr 1fr", padding: "16px 20px", borderBottom: i < list.length - 1 ? "var(--border-hair)" : "none", alignItems: "center" }}>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <span style={{ width: 34, height: 34, display: "grid", placeItems: "center", background: "var(--grape-100)", border: "var(--border-hair)", borderRadius: "50%", font: "700 13px/1 var(--font-body)", color: "var(--grape-700)" }}>
                  {(b.name || "?").charAt(0)}
                </span>
                <span style={{ font: "600 14px/1.3 var(--font-body)", color: "var(--text-strong)" }}>{b.name}</span>
              </div>
              <span style={{ font: "var(--type-body)", color: "var(--text-body)" }}>{b.location || "—"}</span>
              <span style={{ font: "700 15px/1 var(--font-mono)", color: "var(--text-strong)" }}>{b.customerCount ?? "—"}</span>
              <Badge tone={b.status === "active" ? "success" : "danger"} size="sm">{b.status || "active"}</Badge>
              <div style={{ display: "flex", gap: 8 }}>
                <Button variant="ghost" size="sm" onClick={() => router.push(`/business/${b._id || b.id}`)}>Open</Button>
                <button onClick={() => { if (confirm(`Delete ${b.name}?`)) deleteMut.mutate(b._id || b.id); }} style={{ width: 32, height: 32, display: "grid", placeItems: "center", background: "var(--coral-100)", border: "var(--border-hair)", borderRadius: "var(--radius-sm)", cursor: "pointer", color: "var(--coral-700)" }}>
                  <Icon name="trash-2" size={14} />
                </button>
              </div>
            </div>
          ))}
          {list.length === 0 && <div style={{ padding: 40, textAlign: "center", color: "var(--text-muted)" }}>No businesses yet.</div>}
        </Card>
      )}
    </div>
  );

  const CreateBusiness = (
    <div style={{ padding: 32, display: "flex", flexDirection: "column", gap: 28, maxWidth: 640 }}>
      <div>
        <div style={{ font: "var(--type-label)", letterSpacing: "var(--tracking-label)", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 8 }}>Admin</div>
        <h1 style={{ margin: 0, font: "var(--type-title)", letterSpacing: "var(--tracking-display)", color: "var(--text-strong)" }}>Create business</h1>
      </div>
      <Card pad={24}>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <Input
            label="Business name"
            placeholder="e.g. Kaapi House"
            icon="store"
            value={newName}
            onChange={(v) => { setNewName(v); if (createFieldErrors.name) setCreateFieldErrors((f) => ({ ...f, name: undefined })); }}
            error={createFieldErrors.name}
          />
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <label style={{ font: "var(--type-label)", letterSpacing: "var(--tracking-label)", textTransform: "uppercase", color: "var(--text-muted)" }}>Template</label>
            <div style={{ display: "flex", gap: 8 }}>
              {templates.map((t) => (
                <button key={t.key} title={t.description} onClick={() => setNewTemplate(t.key)} style={{ padding: "10px 20px", borderRadius: "var(--radius-pill)", border: newTemplate === t.key ? "var(--border)" : "3px solid transparent", background: newTemplate === t.key ? "var(--grape-100)" : "var(--paper-000)", font: "var(--type-button)", color: newTemplate === t.key ? "var(--grape-700)" : "var(--text-muted)", cursor: "pointer" }}>{t.label}</button>
              ))}
            </div>
          </div>
          <Input
            label="Owner email"
            placeholder="owner@business.com"
            icon="mail"
            type="email"
            value={newEmail}
            onChange={(v) => { setNewEmail(v); if (createFieldErrors.ownerEmail) setCreateFieldErrors((f) => ({ ...f, ownerEmail: undefined })); }}
            error={createFieldErrors.ownerEmail}
          />
          <Input
            label="Owner password"
            placeholder="At least 8 characters"
            icon="lock"
            type="password"
            value={newPass}
            onChange={(v) => { setNewPass(v); if (createFieldErrors.ownerPassword) setCreateFieldErrors((f) => ({ ...f, ownerPassword: undefined })); }}
            error={createFieldErrors.ownerPassword}
          />
          <Input
            label="Staff PIN (optional)"
            placeholder="4-6 digit PIN"
            icon="hash"
            mono
            value={newPin}
            onChange={(v) => { setNewPin(v); if (createFieldErrors.pin) setCreateFieldErrors((f) => ({ ...f, pin: undefined })); }}
            error={createFieldErrors.pin}
          />
          <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
            <Button variant="primary" size="md" onClick={handleCreate} disabled={createMut.isPending || !newName || !newEmail || !newPass}>
              {createMut.isPending ? "Creating..." : "Create business"}
            </Button>
            <Button variant="ghost" size="md" onClick={() => setTab("businesses")}>Cancel</Button>
          </div>
          {createFormError && <div role="alert" style={{ font: "600 14px/1.4 var(--font-body)", color: "var(--danger-ink)" }}>{createFormError}</div>}
        </div>
      </Card>
    </div>
  );

  return (
    <div style={{ display: "flex", height: "100vh", background: "var(--surface-page)" }}>
      {Sidebar}
      <main style={{ flex: 1, overflowY: "auto", maxWidth: "var(--width-panel)" }}>
        {tab === "businesses" ? BusinessList : CreateBusiness}
      </main>
      <Dialog open={showCreate} title="Create new business" onClose={() => setShowCreate(false)} width={480}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Input label="Business name" placeholder="e.g. Kaapi House" value={newName} onChange={setNewName} />
          <Input label="Owner email" placeholder="owner@business.com" value={newEmail} onChange={setNewEmail} />
          <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
            <Button variant="primary" size="sm" onClick={() => { setShowCreate(false); setTab("create"); }}>Continue</Button>
            <Button variant="ghost" size="sm" onClick={() => setShowCreate(false)}>Cancel</Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
