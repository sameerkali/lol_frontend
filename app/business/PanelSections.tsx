"use client";
import React from "react";
import { Button } from "../components/core/Button";
import { Card } from "../components/core/Card";
import { Badge } from "../components/core/Badge";
import { Icon } from "../components/core/Icon";
import { Input } from "../components/forms/Input";
import { Select } from "../components/forms/Select";
import { StatTile } from "../components/loyalty/StatTile";
import { TableSkeleton, SkeletonStatRow } from "../components/feedback/Skeleton";

export function SectionHeader({ eyebrow, title, action }: { eyebrow: string; title: string; action?: React.ReactNode }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, flexWrap: "wrap" }}>
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

/** Formats a "YYYY-MM-DD" date of birth, or the legacy "MM-DD"-only value, for display. */
export function formatDob(dob?: string | null): string {
  if (!dob) return "—";
  if (/^\d{4}-\d{2}-\d{2}$/.test(dob)) {
    const d = new Date(`${dob}T00:00:00`);
    return d.toLocaleDateString(undefined, { day: "2-digit", month: "short", year: "numeric" });
  }
  const legacy = /^(\d{2})-(\d{2})$/.exec(dob);
  if (legacy) {
    const d = new Date(2000, Number(legacy[1]) - 1, Number(legacy[2]));
    return d.toLocaleDateString(undefined, { day: "2-digit", month: "short" });
  }
  return dob;
}

/* ---------------------------- Dashboard ---------------------------- */

export function DashboardSection({
  title,
  dash,
  list,
  birthdayList,
  pin,
  pinRevealed,
  onTogglePinReveal,
  onEditPin,
  padded = true,
}: {
  title: string;
  dash: any;
  list: any[];
  birthdayList: any[];
  pin?: string | null;
  pinRevealed: boolean;
  onTogglePinReveal: () => void;
  onEditPin: () => void;
  /** false when the parent page already supplies its own outer padding (e.g. the admin business detail shell). */
  padded?: boolean;
}) {
  return (
    <div className={padded ? "lol-page-pad" : undefined} style={{ padding: padded ? 32 : 0, display: "flex", flexDirection: "column", gap: 28 }}>
      <SectionHeader eyebrow="Dashboard" title={title} />
      {dash ? (
        <div className="lol-stat-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
          <StatTile label="Total customers" value={dash.totalCustomers ?? list.length} icon="users" tone="grape" />
          <StatTile label="Visits (30d)" value={dash.visits ?? 0} icon="stamp" tone="mint" />
          <StatTile label="Redemptions (30d)" value={dash.redemptions ?? 0} icon="gift" tone="sun" />
          <StatTile label="Repeat visit rate" value={dash.repeatVisitRate != null ? `${dash.repeatVisitRate}%` : "—"} icon="trending-up" tone="sky" />
        </div>
      ) : (
        <SkeletonStatRow />
      )}

      {dash?.tierBreakdown?.length > 0 && (
        <Card pad={20} elevation={1}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <Icon name="crown" size={20} color="var(--grape-500)" />
            <div style={{ font: "var(--type-subtitle)", color: "var(--text-strong)" }}>Customers by tier</div>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {dash.tierBreakdown.map((t: any) => (
              <div
                key={t.tierName}
                style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 14px", background: "var(--surface-sunk)", border: "var(--border-hair)", borderRadius: "var(--radius-pill)" }}
              >
                <Badge tone="reward" size="sm">{t.tierName}</Badge>
                <span style={{ font: "700 15px/1 var(--font-mono)", color: "var(--text-strong)" }}>{t.count}</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {birthdayList.length > 0 && (
        <Card tone="sun" pad={20} elevation={1}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <Icon name="cake" size={20} color="var(--sun-700)" />
            <div style={{ font: "var(--type-subtitle)", color: "var(--text-strong)" }}>Birthdays today 🎉</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {birthdayList.map((c: any, i: number) => (
              <div key={c._id || i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: i < birthdayList.length - 1 ? "var(--border-hair)" : "none" }}>
                <span style={{ font: "600 14px/1.3 var(--font-body)", color: "var(--text-strong)" }}>{c.name || c.phone}</span>
                <span style={{ font: "var(--type-mono)", color: "var(--text-muted)", fontSize: 13 }}>{c.phone}</span>
              </div>
            ))}
          </div>
          <div style={{ font: "var(--type-body-sm)", color: "var(--text-muted)", marginTop: 12 }}>
            Give them a shout when they visit — a free treat or a discount goes a long way.
          </div>
        </Card>
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
                {pin ? (pinRevealed ? pin : "••••") : "Not set"}
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {pin && (
              <Button variant="ghost" size="sm" icon={<Icon name={pinRevealed ? "eye-off" : "eye"} size={16} />} onClick={onTogglePinReveal}>
                {pinRevealed ? "Hide" : "Show"}
              </Button>
            )}
            <Button variant="secondary" size="sm" icon={<Icon name="pencil" size={16} />} onClick={onEditPin}>
              Change
            </Button>
          </div>
        </div>
      </Card>

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
    </div>
  );
}

/* ---------------------------- Customers ---------------------------- */

export function CustomerTable({
  customers,
  loading,
  tierNames,
  search,
  onSearchChange,
  sort,
  onSortChange,
  tier,
  onTierChange,
  onlyUnredeemed,
  onOnlyUnredeemedChange,
  onExport,
  onRowClick,
  padded = true,
}: {
  customers: any[];
  loading: boolean;
  tierNames: string[];
  search: string;
  onSearchChange: (v: string) => void;
  sort: string;
  onSortChange: (v: string) => void;
  tier: string;
  onTierChange: (v: string) => void;
  onlyUnredeemed: boolean;
  onOnlyUnredeemedChange: (v: boolean) => void;
  onExport?: () => void;
  onRowClick: (c: any) => void;
  /** false when the parent page already supplies its own outer padding (e.g. the admin business detail shell). */
  padded?: boolean;
}) {
  const list = customers || [];
  return (
    <div className={padded ? "lol-page-pad" : undefined} style={{ padding: padded ? 32 : 0, display: "flex", flexDirection: "column", gap: 20 }}>
      <SectionHeader
        eyebrow="Customers"
        title="All customers"
        action={
          onExport && (
            <Button variant="secondary" size="sm" icon={<Icon name="download" size={16} />} onClick={onExport}>
              Export CSV
            </Button>
          )
        }
      />
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
        <Input placeholder="Search by phone..." icon="search" value={search} onChange={onSearchChange} style={{ width: 240 }} />
        <Select value={sort} onChange={onSortChange} options={[
          { value: "newest", label: "Newest first" },
          { value: "visits", label: "Most visits" },
          { value: "lastVisit", label: "Last visit" },
          ...(tierNames.length > 0 ? [{ value: "tier", label: "Tier (highest first)" }] : []),
        ]} style={{ width: 190 }} />
        {tierNames.length > 0 && (
          <Select
            value={tier}
            onChange={onTierChange}
            options={[{ value: "", label: "All tiers" }, ...tierNames.map((t) => ({ value: t, label: t }))]}
            style={{ width: 170 }}
          />
        )}
        <label style={{ display: "flex", alignItems: "center", gap: 8, font: "var(--type-body-sm)", color: "var(--text-body)", cursor: "pointer" }}>
          <input type="checkbox" checked={onlyUnredeemed} onChange={(e) => onOnlyUnredeemedChange(e.target.checked)} />
          Unredeemed rewards only
        </label>
      </div>
      {loading ? <TableSkeleton rows={6} columns={5} /> : (
        <Card pad={0} elevation={1} style={{ overflow: "hidden" }}>
        <div className="lol-table-scroll">
          <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1.2fr 1fr 0.7fr 0.7fr 0.9fr 1fr", padding: "14px 20px", borderBottom: "var(--border)", background: "var(--paper-200)", minWidth: 780 }}>
            {["Name", "Phone", "DOB", "Visits", "Points", "Tier", "Last visit"].map((h) => (
              <span key={h} style={{ font: "var(--type-label)", letterSpacing: "var(--tracking-label)", textTransform: "uppercase", color: "var(--text-muted)" }}>{h}</span>
            ))}
          </div>
          {list.map((c: any, i: number) => (
            <div
              key={c._id || i}
              onClick={() => onRowClick(c)}
              style={{ display: "grid", gridTemplateColumns: "1.6fr 1.2fr 1fr 0.7fr 0.7fr 0.9fr 1fr", padding: "16px 20px", borderBottom: i < list.length - 1 ? "var(--border-hair)" : "none", alignItems: "center", minWidth: 780, cursor: "pointer" }}
            >
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <span style={{ width: 34, height: 34, display: "grid", placeItems: "center", background: "var(--grape-100)", border: "var(--border-hair)", borderRadius: "50%", font: "700 13px/1 var(--font-body)", color: "var(--grape-700)" }}>
                  {(c.name || c.phone || "?").charAt(0)}
                </span>
                <span style={{ font: "600 14px/1.3 var(--font-body)", color: "var(--text-strong)" }}>{c.name || "—"}</span>
              </div>
              <span style={{ font: "var(--type-mono)", color: "var(--text-body)", fontSize: 13 }}>{c.phone}</span>
              <span style={{ font: "var(--type-body-sm)", color: "var(--text-muted)" }}>{formatDob(c.dob)}</span>
              <span style={{ font: "700 15px/1 var(--font-mono)", color: "var(--text-strong)" }}>{c.totalVisits ?? 0}</span>
              <span style={{ font: "700 15px/1 var(--font-mono)", color: "var(--text-strong)" }}>{c.totalPoints ?? 0}</span>
              <Badge tone={c.ruleSnapshot?.tierName ? "reward" : "neutral"} size="sm">{c.ruleSnapshot?.tierName || "—"}</Badge>
              <span style={{ font: "var(--type-body-sm)", color: "var(--text-muted)" }}>{c.lastVisitAt ? new Date(c.lastVisitAt).toLocaleDateString() : "—"}</span>
            </div>
          ))}
          {list.length === 0 && <div style={{ padding: 40, textAlign: "center", color: "var(--text-muted)" }}>No customers yet. Put the tag on the counter.</div>}
        </div>
        </Card>
      )}
    </div>
  );
}
