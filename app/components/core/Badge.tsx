"use client";
import React from "react";
import { Icon } from "./Icon";

const TONES: Record<string, React.CSSProperties> = {
  neutral: { background: "var(--paper-000)", color: "var(--ink-900)" },
  success: { background: "var(--mint-500)", color: "var(--ink-900)" },
  reward: { background: "var(--sun-500)", color: "var(--ink-900)" },
  danger: { background: "var(--coral-500)", color: "var(--ink-900)" },
  info: { background: "var(--sky-500)", color: "var(--ink-900)" },
};

export function Badge({
  children,
  tone = "neutral",
  icon,
  size = "md",
  style,
}: {
  children: React.ReactNode;
  tone?: string;
  icon?: string;
  size?: string;
  style?: React.CSSProperties;
}) {
  const sm = size === "sm";
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: sm ? "4px 10px" : "7px 14px",
        font: `700 ${sm ? 10 : 12}px/1 var(--font-body)`,
        letterSpacing: "var(--tracking-label)",
        textTransform: "uppercase",
        border: "var(--border-hair)",
        borderRadius: "var(--radius-pill)",
        ...TONES[tone],
        ...style,
      }}
    >
      {icon ? <Icon name={icon} size={sm ? 12 : 14} /> : null}
      {children}
    </span>
  );
}
