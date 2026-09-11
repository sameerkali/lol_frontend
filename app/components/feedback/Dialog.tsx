"use client";
import React from "react";
import { Icon } from "../core/Icon";

export function Dialog({
  open = true,
  title,
  children,
  onClose,
  width = 420,
  footer,
}: {
  open?: boolean;
  title?: string;
  children: React.ReactNode;
  onClose?: () => void;
  width?: number;
  footer?: React.ReactNode;
}) {
  if (!open) return null;
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        background: "rgba(27,21,38,0.55)",
        backdropFilter: "blur(3px)",
        display: "grid",
        placeItems: "center",
        padding: 20,
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: width,
          background: "var(--surface-card)",
          border: "var(--border)",
          borderRadius: "var(--radius-xl)",
          boxShadow: "var(--pop-3)",
          padding: 24,
          animation: "lol-pop-in var(--dur-base) var(--ease-pop) both",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, marginBottom: 16 }}>
          <h2 style={{ margin: 0, font: "var(--type-title)", letterSpacing: "var(--tracking-display)", color: "var(--text-strong)" }}>
            {title}
          </h2>
          {onClose ? (
            <button
              onClick={onClose}
              aria-label="Close"
              style={{
                width: 36,
                height: 36,
                display: "grid",
                placeItems: "center",
                background: "var(--paper-000)",
                border: "var(--border)",
                borderRadius: "var(--radius-sm)",
                boxShadow: "var(--pop-1)",
                cursor: "pointer",
              }}
            >
              <Icon name="x" size={18} />
            </button>
          ) : null}
        </div>
        <div style={{ font: "var(--type-body)", color: "var(--text-body)" }}>
          {children}
        </div>
        {footer ? (
          <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", marginTop: 24 }}>
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  );
}
