"use client";
import React from "react";
import { Card } from "../components/core/Card";
import { Badge } from "../components/core/Badge";
import { Icon } from "../components/core/Icon";
import { Skeleton } from "../components/feedback/Skeleton";
import { formatDob } from "./PanelSections";

function calcAge(dob?: string | null): number | null {
  if (!dob || !/^\d{4}-\d{2}-\d{2}$/.test(dob)) return null;
  const birth = new Date(`${dob}T00:00:00`);
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const m = now.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--;
  return age;
}

/** India-only phone convention used across this app (see PhoneInput's default +91 dial code) — a bare 10-digit number gets that prefix for wa.me. */
function toWhatsAppNumber(phone?: string): string {
  const digits = (phone || "").replace(/\D/g, "");
  if (digits.length === 10) return `91${digits}`;
  return digits;
}

export function buildWhatsAppLink(phone: string | undefined, message: string): string {
  const number = toWhatsAppNumber(phone);
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

const MESSAGE_TEMPLATES: { key: string; title: string; build: (name: string, business: string) => string }[] = [
  {
    key: "we_miss_you",
    title: "We miss you",
    build: (name, business) => `Hi ${name}, it's been a while since we've seen you at ${business}! We'd love to have you back — come say hi soon. 😊`,
  },
  {
    key: "reward_ready",
    title: "Reward waiting",
    build: (name, business) => `Hi ${name}, good news — you have a reward waiting for you at ${business}! Drop by and redeem it whenever you like. 🎁`,
  },
  {
    key: "birthday",
    title: "Birthday wish",
    build: (name, business) => `Happy Birthday, ${name}! 🎂 Come celebrate with us at ${business} today — a little something special is waiting for you.`,
  },
  {
    key: "almost_there",
    title: "Almost at next reward",
    build: (name, business) => `Hi ${name}, you're almost at your next reward at ${business}! Just a few more visits to go. 🚀`,
  },
  {
    key: "thank_you",
    title: "Thank you",
    build: (name, business) => `Thank you for being a loyal customer at ${business}, ${name}! We really appreciate you. ❤️`,
  },
];

function InfoTile({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <span style={{ font: "var(--type-label)", letterSpacing: "var(--tracking-label)", textTransform: "uppercase", color: "var(--text-muted)" }}>{label}</span>
      <span style={{ font: "600 16px/1.3 var(--font-body)", color: "var(--text-strong)" }}>{value}</span>
    </div>
  );
}

export function CustomerDetailView({
  customer,
  loading,
  error,
  businessName,
  onBack,
}: {
  customer: any;
  loading: boolean;
  error?: boolean;
  businessName: string;
  onBack: () => void;
}) {
  const BackButton = (
    <button
      onClick={onBack}
      style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "transparent", border: 0, cursor: "pointer", color: "var(--text-muted)", font: "600 14px/1 var(--font-body)", padding: 0, width: "fit-content" }}
    >
      <Icon name="arrow-left" size={16} /> Back to customers
    </button>
  );

  if (error) {
    return (
      <div className="lol-page-pad" style={{ padding: 32, display: "flex", flexDirection: "column", gap: 24, maxWidth: 720 }}>
        {BackButton}
        <Card pad={40} style={{ textAlign: "center" }}>
          <Icon name="alert-triangle" size={28} color="var(--coral-700)" />
          <div style={{ font: "var(--type-subtitle)", color: "var(--text-strong)", marginTop: 12 }}>This customer couldn&apos;t be loaded</div>
          <div style={{ font: "var(--type-body-sm)", color: "var(--text-muted)", marginTop: 6 }}>They may have been removed, or the link is wrong.</div>
        </Card>
      </div>
    );
  }

  if (loading || !customer) {
    return (
      <div className="lol-page-pad" style={{ padding: 32, display: "flex", flexDirection: "column", gap: 24, maxWidth: 720 }}>
        {BackButton}
        <Skeleton width={220} height={30} />
        <Skeleton height={160} radius="var(--radius-lg)" />
        <Skeleton height={220} radius="var(--radius-lg)" />
      </div>
    );
  }

  const c = customer;
  const name = c.name || c.phone || "this customer";
  const age = calcAge(c.dob);
  const history = c.history || [];
  const rewards = c.rewards || c.availableRewards || [];

  return (
    <div className="lol-page-pad" style={{ padding: 32, display: "flex", flexDirection: "column", gap: 24, maxWidth: 720 }}>
      {BackButton}

      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <span style={{ width: 56, height: 56, display: "grid", placeItems: "center", background: "var(--grape-100)", border: "var(--border)", borderRadius: "50%", font: "700 22px/1 var(--font-body)", color: "var(--grape-700)" }}>
          {(c.name || c.phone || "?").charAt(0)}
        </span>
        <div>
          <h1 style={{ margin: 0, font: "var(--type-title)", letterSpacing: "var(--tracking-display)", color: "var(--text-strong)" }}>{c.name || "Unnamed customer"}</h1>
          <div style={{ font: "var(--type-mono)", color: "var(--text-muted)", fontSize: 13, marginTop: 4 }}>{c.phone}</div>
        </div>
        {c.ruleSnapshot?.tierName && <Badge tone="reward" size="sm" style={{ marginLeft: "auto" }}>{c.ruleSnapshot.tierName}</Badge>}
      </div>

      <Card pad={24}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 20 }}>
          <InfoTile label="Total visits" value={c.totalVisits ?? 0} />
          <InfoTile label="Total points" value={c.totalPoints ?? 0} />
          <InfoTile label="Last visit" value={c.lastVisitAt ? new Date(c.lastVisitAt).toLocaleDateString() : "—"} />
          <InfoTile label="Customer since" value={c.createdAt ? new Date(c.createdAt).toLocaleDateString() : "—"} />
          <InfoTile label="Date of birth" value={age != null ? `${formatDob(c.dob)} (${age})` : formatDob(c.dob)} />
          <InfoTile label="Email" value={c.email || "—"} />
        </div>
      </Card>

      {rewards.length > 0 && (
        <Card pad={24}>
          <div style={{ font: "var(--type-subtitle)", color: "var(--text-strong)", marginBottom: 16 }}>Rewards</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {rewards.map((r: any, i: number) => (
              <div key={r._id || i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: i < rewards.length - 1 ? "var(--border-hair)" : "none" }}>
                <span style={{ font: "600 14px/1.3 var(--font-body)", color: "var(--text-strong)" }}>{r.label || r.rewardValue || "Reward"}</span>
                <Badge tone={r.redeemedAt ? "neutral" : "success"} size="sm">{r.redeemedAt ? "Redeemed" : "Unredeemed"}</Badge>
              </div>
            ))}
          </div>
        </Card>
      )}

      {history.length > 0 && (
        <Card pad={24}>
          <div style={{ font: "var(--type-subtitle)", color: "var(--text-strong)", marginBottom: 16 }}>Visit history</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {history.map((r: any, i: number) => (
              <div key={r._id || i} style={{ display: "flex", gap: 14, alignItems: "center", padding: "10px 0", borderBottom: i < history.length - 1 ? "var(--border-hair)" : "none" }}>
                <Icon name={r.type === "visit" ? "stamp" : "gift"} size={16} color="var(--text-muted)" />
                <span style={{ flex: 1, font: "600 14px/1.3 var(--font-body)", color: "var(--text-strong)" }}>{r.type === "visit" ? "Visit marked" : "Reward redeemed"}</span>
                <span style={{ font: "var(--type-mono)", color: "var(--text-muted)", fontSize: 12 }}>{r.createdAt ? new Date(r.createdAt).toLocaleDateString() : "—"}</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      <Card pad={24}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
          <Icon name="whatsapp" size={20} color="#25D366" />
          <div style={{ font: "var(--type-subtitle)", color: "var(--text-strong)" }}>Send a message</div>
        </div>
        <div style={{ font: "var(--type-body-sm)", color: "var(--text-muted)", marginBottom: 16 }}>
          Pick a template — it opens WhatsApp with the message pre-filled for {c.phone}.
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {MESSAGE_TEMPLATES.map((t) => {
            const message = t.build(name, businessName);
            return (
              <div
                key={t.key}
                style={{ display: "flex", gap: 14, alignItems: "center", padding: 14, background: "var(--surface-sunk)", border: "var(--border-hair)", borderRadius: "var(--radius-md)", flexWrap: "wrap" }}
              >
                <div style={{ flex: "1 1 240px", minWidth: 0 }}>
                  <div style={{ font: "600 14px/1.3 var(--font-body)", color: "var(--text-strong)" }}>{t.title}</div>
                  <div style={{ font: "var(--type-body-sm)", color: "var(--text-muted)", marginTop: 2 }}>{message}</div>
                </div>
                <a
                  href={buildWhatsAppLink(c.phone, message)}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 18px", background: "#25D366", color: "#fff", borderRadius: "var(--radius-pill)", font: "700 13px/1 var(--font-body)", textDecoration: "none", flex: "0 0 auto" }}
                >
                  <Icon name="whatsapp" size={16} color="#fff" /> WhatsApp
                </a>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
