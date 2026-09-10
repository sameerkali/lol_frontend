"use client";
import React from "react";
import { Icon } from "../core/Icon";

const TONES: Record<string, { background: string; icon: string }> = {
  success: { background: "var(--mint-500)", icon: "check-circle" },
  danger: { background: "var(--coral-500)", icon: "alert-circle" },
  info: { background: "var(--sky-500)", icon: "info" },
  reward: { background: "var(--sun-500)", icon: "gift" },
};

export function Toast({
  children,
  tone = "success",
  style,
}: {
  children: React.ReactNode;
  tone?: string;
  style?: React.CSSProperties;
}) {
  const t = TONES[tone] || TONES.info;
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 12,
        background: t.background,
        color: "var(--ink-900)",
        border: "var(--border)",
        borderRadius: "var(--radius-pill)",
        boxShadow: "var(--pop-2)",
        padding: "14px 20px",
        font: "600 15px/1.2 var(--font-body)",
        animation: "lol-rise var(--dur-base) var(--ease-pop) both",
        ...style,
      }}
    >
      <Icon name={t.icon} size={20} />
      <span>{children}</span>
    </div>
  );
}
