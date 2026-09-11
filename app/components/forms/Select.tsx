"use client";
import React from "react";
import { Icon } from "../core/Icon";

export interface SelectOption {
  value: string;
  label: string;
}

export function Select({
  label,
  hint,
  error,
  value,
  onChange,
  options = [],
  disabled = false,
  placeholder,
  style,
}: {
  label?: string;
  hint?: string;
  error?: string;
  value?: string;
  onChange?: (v: string) => void;
  options: (SelectOption | string)[];
  disabled?: boolean;
  placeholder?: string;
  style?: React.CSSProperties;
}) {
  const rid = React.useId();
  const errorId = `${rid}-error`;
  const hintId = `${rid}-hint`;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, minWidth: 0, ...style }}>
      {label ? (
        <label
          htmlFor={rid}
          style={{
            font: "var(--type-label)",
            letterSpacing: "var(--tracking-label)",
            textTransform: "uppercase",
            color: "var(--text-muted)",
          }}
        >
          {label}
        </label>
      ) : null}
      <div
        style={{
          position: "relative",
          background: disabled ? "var(--ink-100)" : "var(--paper-000)",
          border: `3px solid ${error ? "var(--coral-500)" : "var(--line)"}`,
          borderRadius: "var(--radius-md)",
          boxShadow: "var(--pop-1)",
        }}
      >
        <select
          id={rid}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange && onChange(e.target.value)}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : hint ? hintId : undefined}
          style={{
            appearance: "none",
            width: "100%",
            border: 0,
            outline: "none",
            background: "transparent",
            font: "600 16px/1 var(--font-body)",
            color: "var(--text-strong)",
            padding: "19px 44px 19px 16px",
            cursor: disabled ? "not-allowed" : "pointer",
          }}
        >
          {placeholder ? (
            <option value="" disabled>
              {placeholder}
            </option>
          ) : null}
          {options.map((o) => {
            const val = typeof o === "string" ? o : o.value;
            const lab = typeof o === "string" ? o : o.label;
            return (
              <option key={val} value={val}>
                {lab}
              </option>
            );
          })}
        </select>
        <span style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
          <Icon name="chevron-down" size={20} color="var(--ink-500)" />
        </span>
      </div>
      {error ? (
        <span id={errorId} role="alert" style={{ font: "var(--type-body-sm)", color: "var(--danger-ink)", fontWeight: 600 }}>
          {error}
        </span>
      ) : hint ? (
        <span id={hintId} style={{ font: "var(--type-body-sm)", color: "var(--text-muted)" }}>
          {hint}
        </span>
      ) : null}
    </div>
  );
}
