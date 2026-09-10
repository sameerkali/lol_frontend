"use client";
import React from "react";
import { Icon } from "../core/Icon";

export function Input({
  label,
  hint,
  error,
  value,
  onChange,
  placeholder,
  type = "text",
  prefix,
  icon,
  mono = false,
  disabled = false,
  style,
}: {
  label?: string;
  hint?: string;
  error?: string;
  value?: string;
  onChange?: (v: string) => void;
  placeholder?: string;
  type?: string;
  prefix?: string;
  icon?: string;
  mono?: boolean;
  disabled?: boolean;
  style?: React.CSSProperties;
}) {
  const [focus, setFocus] = React.useState(false);
  const rid = React.useId();
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, ...style }}>
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
          display: "flex",
          alignItems: "center",
          gap: 10,
          background: disabled ? "var(--ink-100)" : "var(--paper-000)",
          border: `3px solid ${error ? "var(--coral-500)" : "var(--line)"}`,
          borderRadius: "var(--radius-md)",
          boxShadow: focus ? "var(--pop-pressed)" : "var(--pop-1)",
          transform: focus ? "translate(2px,2px)" : "none",
          transition: "all var(--dur-fast) var(--ease-out)",
          padding: "0 16px",
          minHeight: 56,
        }}
      >
        {icon ? <Icon name={icon} size={20} color="var(--ink-500)" /> : null}
        {prefix ? (
          <span style={{ font: "var(--type-mono)", color: "var(--text-muted)" }}>
            {prefix}
          </span>
        ) : null}
        <input
          id={rid}
          type={type}
          value={value}
          placeholder={placeholder}
          disabled={disabled}
          onChange={(e) => onChange && onChange(e.target.value)}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          style={{
            flex: 1,
            minWidth: 0,
            border: 0,
            outline: "none",
            background: "transparent",
            font: mono
              ? "700 18px/1 var(--font-mono)"
              : "500 16px/1 var(--font-body)",
            letterSpacing: mono ? "var(--tracking-mono)" : "0",
            color: "var(--text-strong)",
            padding: "17px 0",
          }}
        />
      </div>
      {error ? (
        <span style={{ font: "var(--type-body-sm)", color: "var(--danger-ink)", fontWeight: 600 }}>
          {error}
        </span>
      ) : hint ? (
        <span style={{ font: "var(--type-body-sm)", color: "var(--text-muted)" }}>
          {hint}
        </span>
      ) : null}
    </div>
  );
}
