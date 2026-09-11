"use client";
import React from "react";

export function NumberInput({
  label,
  hint,
  error,
  value,
  onChange,
  placeholder,
  min,
  max,
  step = 1,
  prefix,
  disabled = false,
  style,
}: {
  label?: string;
  hint?: string;
  error?: string;
  value: number | "";
  onChange: (v: number | "") => void;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
  prefix?: string;
  disabled?: boolean;
  style?: React.CSSProperties;
}) {
  const [focus, setFocus] = React.useState(false);
  const rid = React.useId();
  const errorId = `${rid}-error`;
  const hintId = `${rid}-hint`;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, minWidth: 0, ...style }}>
      {label ? (
        <label
          htmlFor={rid}
          style={{ font: "var(--type-label)", letterSpacing: "var(--tracking-label)", textTransform: "uppercase", color: "var(--text-muted)" }}
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
        {prefix ? <span style={{ font: "var(--type-mono)", color: "var(--text-muted)" }}>{prefix}</span> : null}
        <input
          id={rid}
          type="number"
          inputMode="numeric"
          value={value}
          min={min}
          max={max}
          step={step}
          placeholder={placeholder}
          disabled={disabled}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          onChange={(e) => {
            const raw = e.target.value;
            if (raw === "") { onChange(""); return; }
            const n = Number(raw);
            if (Number.isNaN(n)) return;
            onChange(n);
          }}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : hint ? hintId : undefined}
          style={{
            flex: 1,
            minWidth: 0,
            border: 0,
            outline: "none",
            background: "transparent",
            font: "700 18px/1 var(--font-mono)",
            letterSpacing: "var(--tracking-mono)",
            color: "var(--text-strong)",
            padding: "17px 0",
          }}
        />
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
