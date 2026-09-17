"use client";
import React from "react";
import { Card } from "../components/core/Card";
import { Badge } from "../components/core/Badge";
import { Icon } from "../components/core/Icon";
import { Skeleton } from "../components/feedback/Skeleton";
import { formatDob, formatRewardText } from "./PanelSections";
import { calcAge } from "../lib/validation";

/** India-only phone convention used across this app (see PhoneInput's default +91 dial code) — a bare 10-digit number gets that prefix for wa.me. */
function toWhatsAppNumber(phone?: string): string {
  const digits = (phone || "").replace(/\D/g, "");
  if (digits.length === 10) return `91${digits}`;
  return digits;
}

function buildWhatsAppLink(phone: string | undefined, message: string): string {
  const number = toWhatsAppNumber(phone);
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

const MESSAGE_TEMPLATES: { key: string; title: string; build: (name: string, business: string) => string }[] = [
  {
    key: "we_miss_you",
    title: "We miss you",
    build: (name, business) => `Hi ${name}, it's been a while since we've seen you at ${business}! We'd love to have you back. Come say hi soon. 😊`,
  },
  {
    key: "reward_ready",
    title: "Reward waiting",
    build: (name, business) => `Hi ${name}, good news! You have a reward waiting for you at ${business}. Drop by and redeem it whenever you like. 🎁`,
  },
  {
    key: "birthday",
    title: "Birthday wish",
    build: (name, business) => `Happy Birthday, ${name}! 🎂 Come celebrate with us at ${business} today. A little something special is waiting for you.`,
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

function InfoTile({ icon, label, value }: { icon: string; label: string; value: React.ReactNode }) {
  return (
    <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
      <span style={{ width: 34, height: 34, flex: "0 0 auto", display: "grid", placeItems: "center", background: "var(--surface-sunk)", borderRadius: "var(--radius-sm)" }}>
        <Icon name={icon} size={16} color="var(--ink-500)" />
      </span>
      <div style={{ minWidth: 0 }}>
        <div style={{ font: "var(--type-label)", letterSpacing: "var(--tracking-label)", textTransform: "uppercase", color: "var(--text-muted)" }}>{label}</div>
        <div style={{ font: "600 16px/1.3 var(--font-body)", color: "var(--text-strong)", marginTop: 3, wordBreak: "break-word" }}>{value}</div>
      </div>
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
        <Skeleton height={140} radius="var(--radius-lg)" />
        <Skeleton height={200} radius="var(--radius-lg)" />
      </div>
    );
  }

  const c = customer;
  const name = c.name || c.phone || "this customer";
  const age = calcAge(c.dob);
  const history = c.history || [];
  const rewards = c.rewards || c.availableRewards || [];

  return (
    <div className="lol-page-pad" style={{ padding: 32, display: "flex", flexDirection: "column", gap: 20, maxWidth: 720 }}>
      {BackButton}

      <Card pad={0} style={{ overflow: "hidden" }}>
        <div style={{ background: "var(--grape-100)", padding: "24px", display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
          <span
            style={{
              width: 64,
              height: 64,
              flex: "0 0 auto",
              display: "grid",
              placeItems: "center",
              background: "var(--paper-000)",
              border: "var(--border)",
              borderRadius: "50%",
              font: "800 26px/1 var(--font-display)",
              color: "var(--grape-700)",
            }}
          >
            {(c.name || c.phone || "?").charAt(0).toUpperCase()}
          </span>
          <div style={{ flex: "1 1 160px", minWidth: 0 }}>
            <h1 style={{ margin: 0, font: "var(--type-subtitle)", letterSpacing: "var(--tracking-display)", color: "var(--text-strong)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {c.name || "Unnamed customer"}
            </h1>
            <div style={{ font: "var(--type-mono)", color: "var(--ink-700)", fontSize: 13, marginTop: 4 }}>{c.phone}</div>
          </div>
          {c.ruleSnapshot?.tierName && <Badge tone="reward" size="sm">{c.ruleSnapshot.tierName}</Badge>}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 20, padding: 24 }}>
          <InfoTile icon="stamp" label="Total visits" value={c.totalVisits ?? 0} />
          <InfoTile icon="award" label="Total points" value={c.totalPoints ?? 0} />
          <InfoTile icon="history" label="Last visit" value={c.lastVisitAt ? new Date(c.lastVisitAt).toLocaleDateString() : "—"} />
          <InfoTile icon="user" label="Customer since" value={c.createdAt ? new Date(c.createdAt).toLocaleDateString() : "—"} />
          <InfoTile icon="cake" label="Date of birth" value={age != null ? `${formatDob(c.dob)} (${age})` : formatDob(c.dob)} />
          <InfoTile icon="mail" label="Email" value={c.email || "—"} />
        </div>
      </Card>

      {rewards.length > 0 && (
        <Card pad={24}>
          <div style={{ font: "var(--type-subtitle)", color: "var(--text-strong)", marginBottom: 16 }}>Rewards</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {rewards.map((r: any, i: number) => (
              <div key={r._id || i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: i < rewards.length - 1 ? "var(--border-hair)" : "none" }}>
                <span style={{ font: "600 14px/1.3 var(--font-body)", color: "var(--text-strong)", minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {r.label || formatRewardText(r.rewardType, r.rewardValue)}
                </span>
                <Badge tone={r.redeemedAt ? "neutral" : "success"} size="sm" style={{ flex: "0 0 auto" }}>{r.redeemedAt ? "Redeemed" : "Unredeemed"}</Badge>
              </div>
            ))}
          </div>
        </Card>
      )}

      <Card pad={24}>
        <div style={{ font: "var(--type-subtitle)", color: "var(--text-strong)", marginBottom: 16 }}>Visit history</div>
        {history.length === 0 ? (
          <div style={{ font: "var(--type-body-sm)", color: "var(--text-muted)", textAlign: "center", padding: "16px 0" }}>No visits or redemptions yet.</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {history.map((r: any, i: number) => {
              const isVisit = r.type === "visit";
              return (
                <div key={r._id || i} style={{ display: "flex", gap: 12, alignItems: "center", padding: "10px 0", borderBottom: i < history.length - 1 ? "var(--border-hair)" : "none" }}>
                  <span style={{ width: 34, height: 34, flex: "0 0 auto", display: "grid", placeItems: "center", background: isVisit ? "var(--grape-100)" : "var(--sun-100)", borderRadius: "50%" }}>
                    <Icon name={isVisit ? "stamp" : "gift"} size={15} color={isVisit ? "var(--grape-700)" : "var(--sun-700)"} />
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ font: "600 14px/1.3 var(--font-body)", color: "var(--text-strong)" }}>{isVisit ? "Visit marked" : "Reward redeemed"}</div>
                    {!isVisit && (r.rewardType || r.rewardValue) && (
                      <div style={{ font: "var(--type-body-sm)", color: "var(--text-muted)", marginTop: 1 }}>{formatRewardText(r.rewardType, r.rewardValue)}</div>
                    )}
                  </div>
                  <span style={{ font: "var(--type-mono)", color: "var(--text-muted)", fontSize: 12, flex: "0 0 auto" }}>{r.createdAt ? new Date(r.createdAt).toLocaleDateString() : "—"}</span>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      <Card pad={24}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
          <Icon name="whatsapp" size={20} color="#25D366" />
          <div style={{ font: "var(--type-subtitle)", color: "var(--text-strong)" }}>Send a message</div>
        </div>
        <div style={{ font: "var(--type-body-sm)", color: "var(--text-muted)", marginBottom: 16 }}>
          Pick a template. It opens WhatsApp with the message pre-filled for {c.phone}.
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {MESSAGE_TEMPLATES.map((t) => {
            const message = t.build(name, businessName);
            return (
              <div
                key={t.key}
                className="lol-stack-mobile"
                style={{ display: "flex", gap: 14, alignItems: "center", padding: 14, background: "var(--surface-sunk)", border: "var(--border-hair)", borderRadius: "var(--radius-md)" }}
              >
                <div style={{ flex: "1 1 auto", minWidth: 0 }}>
                  <div style={{ font: "600 14px/1.3 var(--font-body)", color: "var(--text-strong)" }}>{t.title}</div>
                  <div style={{ font: "var(--type-body-sm)", color: "var(--text-muted)", marginTop: 2 }}>{message}</div>
                </div>
                <a
                  href={buildWhatsAppLink(c.phone, message)}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "10px 18px", background: "#25D366", color: "#fff", borderRadius: "var(--radius-pill)", font: "700 13px/1 var(--font-body)", textDecoration: "none", flex: "0 0 auto" }}
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
