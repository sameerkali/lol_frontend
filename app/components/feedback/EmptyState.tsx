"use client";
import React from "react";
import { Icon } from "../core/Icon";

export function EmptyState({
  icon = "inbox",
  title,
  body,
  action,
  style,
}: {
  icon?: string;
  title: string;
  body?: string;
  action?: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        gap: 12,
        padding: 40,
        background: "var(--surface-sunk)",
        border: "3px dashed var(--ink-300)",
        borderRadius: "var(--radius-lg)",
        ...style,
      }}
    >
      <span
        style={{
          width: 60,
          height: 60,
          display: "grid",
          placeItems: "center",
          background: "var(--paper-000)",
          border: "var(--border)",
          borderRadius: "50%",
        }}
      >
        <Icon name={icon} size={26} />
      </span>
      <div style={{ font: "var(--type-subtitle)", letterSpacing: "var(--tracking-display)", color: "var(--text-strong)" }}>
        {title}
      </div>
      {body ? (
        <div style={{ font: "var(--type-body)", color: "var(--text-muted)", maxWidth: 340 }}>
          {body}
        </div>
      ) : null}
      {action}
    </div>
  );
}
