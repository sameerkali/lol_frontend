"use client";
import React from "react";
import { Icon } from "../core/Icon";

export function PinPad({
  minLength = 4,
  maxLength = 6,
  value = "",
  onChange,
  onComplete,
  error,
  title = "Hand the phone to staff",
  subtitle = "Enter the business PIN to confirm.",
}: {
  minLength?: number;
  maxLength?: number;
  value?: string;
  onChange?: (v: string) => void;
  onComplete?: (v: string) => void;
  error?: string;
  title?: string;
  subtitle?: string;
}) {
  // Business PINs are 4-6 digits (owner's choice), so this can't auto-submit
  // at a fixed length — it submits at maxLength, or when Confirm is tapped.
  const push = (d: string) => {
    if (value.length >= maxLength) return;
    const next = value + d;
    onChange && onChange(next);
    if (next.length === maxLength && onComplete) onComplete(next);
  };
  const back = () => onChange && onChange(value.slice(0, -1));
  const confirm = () => {
    if (value.length >= minLength && onComplete) onComplete(value);
  };
  const canConfirm = value.length >= minLength && value.length < maxLength;
  const displayLength = Math.min(Math.max(value.length, minLength), maxLength);
  const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "confirm", "0", "del"];

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ font: "var(--type-title)", letterSpacing: "var(--tracking-display)", color: "var(--text-strong)" }}>
          {title}
        </div>
        <div style={{ font: "var(--type-body)", color: "var(--text-muted)", marginTop: 4 }}>
          {subtitle}
        </div>
      </div>

      <div style={{ display: "flex", gap: 12 }}>
        {Array.from({ length: displayLength }).map((_, i) => (
          <span
            key={i}
            style={{
              width: 52,
              height: 62,
              display: "grid",
              placeItems: "center",
              background: "var(--paper-000)",
              border: `3px solid ${error ? "var(--coral-500)" : "var(--line)"}`,
              borderRadius: "var(--radius-md)",
              boxShadow: i < value.length ? "var(--pop-pressed)" : "var(--pop-1)",
              transform: i < value.length ? "translate(2px,2px)" : "none",
              font: "700 26px/1 var(--font-mono)",
              color: "var(--text-strong)",
              transition: "all var(--dur-fast) var(--ease-pop)",
            }}
          >
            {i < value.length ? "•" : ""}
          </span>
        ))}
      </div>

      {error ? (
        <div style={{ font: "600 14px/1.4 var(--font-body)", color: "var(--danger-ink)" }}>
          {error}
        </div>
      ) : null}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 76px)", gap: 12 }}>
        {keys.map((k, i) =>
          k === "confirm" && !canConfirm ? (
            <span key={i} />
          ) : (
            <button
              key={i}
              onClick={() => (k === "del" ? back() : k === "confirm" ? confirm() : push(k))}
              disabled={k === "confirm" && !canConfirm}
              style={{
                height: 64,
                display: "grid",
                placeItems: "center",
                background: k === "del" ? "var(--paper-200)" : k === "confirm" ? "var(--mint-500)" : "var(--paper-000)",
                border: "var(--border)",
                borderRadius: "var(--radius-md)",
                boxShadow: "var(--pop-1)",
                cursor: "pointer",
                font: "700 24px/1 var(--font-mono)",
                color: "var(--text-strong)",
                transition: "all var(--dur-fast) var(--ease-out)",
              }}
              onPointerDown={(e) => {
                e.currentTarget.style.transform = "translate(2px,2px)";
                e.currentTarget.style.boxShadow = "var(--pop-pressed)";
              }}
              onPointerUp={(e) => {
                e.currentTarget.style.transform = "none";
                e.currentTarget.style.boxShadow = "var(--pop-1)";
              }}
              onPointerLeave={(e) => {
                e.currentTarget.style.transform = "none";
                e.currentTarget.style.boxShadow = "var(--pop-1)";
              }}
            >
              {k === "del" ? <Icon name="delete" size={22} /> : k === "confirm" ? <Icon name="check" size={22} /> : k}
            </button>
          )
        )}
      </div>
    </div>
  );
}
