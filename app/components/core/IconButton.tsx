"use client";
import React from "react";
import { Icon } from "./Icon";

export function IconButton({
  icon,
  label,
  variant = "secondary",
  size = "md",
  onClick,
  style,
}: {
  icon: string;
  label: string;
  variant?: string;
  size?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
}) {
  const s = size === "sm" ? 36 : 44;
  return (
    <button
      onClick={onClick}
      aria-label={label}
      style={{
        width: s,
        height: s,
        display: "grid",
        placeItems: "center",
        background: variant === "secondary" ? "var(--paper-000)" : "var(--grape-500)",
        color: variant === "secondary" ? "var(--ink-900)" : "var(--paper-000)",
        border: "var(--border)",
        borderRadius: "var(--radius-sm)",
        boxShadow: "var(--pop-1)",
        cursor: "pointer",
        transition: "all var(--dur-fast) var(--ease-out)",
        ...style,
      }}
    >
      <Icon name={icon} size={size === "sm" ? 18 : 22} />
    </button>
  );
}
