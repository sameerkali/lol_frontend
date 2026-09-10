"use client";
import React from "react";
import { Icon } from "../core/Icon";

const TONES: Record<string, string> = {
  paper: "var(--paper-000)",
  grape: "var(--grape-100)",
  mint: "var(--mint-100)",
  sun: "var(--sun-100)",
  coral: "var(--coral-100)",
  sky: "var(--sky-100)",
};

export function StatTile({
  label,
  value,
  delta,
  icon,
  tone = "paper",
  style,
}: {
  label: string;
  value: string | number;
  delta?: string;
  icon?: string;
  tone?: string;
  style?: React.CSSProperties;
}) {
  const up = typeof delta === "string" && delta.trim().startsWith("+");
  return (
    <div
      style={{
        background: TONES[tone] || TONES.paper,
        border: "var(--border)",
        borderRadius: "var(--radius-lg)",
        boxShadow: "var(--pop-1)",
        padding: 20,
        display: "flex",
        flexDirection: "column",
        gap: 10,
        minWidth: 0,
        ...style,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
        <span style={{ font: "var(--type-label)", letterSpacing: "var(--tracking-label)", textTransform: "uppercase", color: "var(--text-muted)" }}>
          {label}
        </span>
        {icon ? <Icon name={icon} size={18} color="var(--ink-500)" /> : null}
      </div>
      <div style={{ font: "700 38px/1 var(--font-mono)", color: "var(--text-strong)" }}>
        {value}
      </div>
      {delta ? (
        <div style={{ display: "inline-flex", alignItems: "center", gap: 5, font: "600 13px/1 var(--font-body)", color: up ? "var(--success-ink)" : "var(--danger-ink)" }}>
          <Icon name={up ? "trending-up" : "trending-down"} size={15} />
          {delta}
        </div>
      ) : null}
    </div>
  );
}
