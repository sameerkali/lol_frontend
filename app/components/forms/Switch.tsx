"use client";
import React from "react";

export function Switch({
  checked = false,
  onChange,
  label,
  hint,
  disabled = false,
  style,
}: {
  checked?: boolean;
  onChange?: (v: boolean) => void;
  label?: React.ReactNode;
  hint?: React.ReactNode;
  disabled?: boolean;
  style?: React.CSSProperties;
}) {
  return (
    <div style={{ display: "flex", gap: 16, alignItems: "center", justifyContent: "space-between", minHeight: 48, ...style }}>
      <div>
        {label ? <div style={{ font: "600 15px/1.3 var(--font-body)", color: "var(--text-strong)" }}>{label}</div> : null}
        {hint ? <div style={{ font: "var(--type-body-sm)", color: "var(--text-muted)", marginTop: 2 }}>{hint}</div> : null}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={typeof label === "string" ? label : undefined}
        disabled={disabled}
        onClick={() => onChange && onChange(!checked)}
        style={{
          width: 56,
          height: 32,
          flex: "0 0 auto",
          padding: 3,
          boxSizing: "border-box",
          background: disabled ? "var(--ink-100)" : checked ? "var(--mint-500)" : "var(--paper-200)",
          border: "var(--border)",
          borderRadius: "var(--radius-pill)",
          boxShadow: "var(--pop-1)",
          cursor: disabled ? "not-allowed" : "pointer",
          display: "flex",
          alignItems: "center",
          transition: "background var(--dur-base) var(--ease-out)",
        }}
      >
        <span
          style={{
            width: 22,
            height: 22,
            borderRadius: "50%",
            background: "var(--paper-000)",
            border: "var(--border-hair)",
            transform: `translateX(${checked ? 24 : 0}px)`,
            transition: "transform var(--dur-base) var(--ease-pop)",
          }}
        />
      </button>
    </div>
  );
}
