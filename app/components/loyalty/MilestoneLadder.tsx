"use client";
import React from "react";
import { Icon } from "../core/Icon";
import { Badge } from "../core/Badge";

export function MilestoneLadder({
  milestones = [],
  current = 0,
  compact = false,
}: {
  milestones: { count: number; label: string }[];
  current?: number;
  compact?: boolean;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
      {milestones.map((m, i) => {
        const done = current >= m.count;
        const next = !done && milestones.slice(0, i).every((p) => current >= p.count);
        return (
          <div key={m.count} style={{ display: "flex", gap: 16, alignItems: "stretch" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 48 }}>
              <span
                style={{
                  width: 44,
                  height: 44,
                  flex: "0 0 auto",
                  display: "grid",
                  placeItems: "center",
                  background: done ? "var(--sun-500)" : next ? "var(--paper-000)" : "var(--paper-200)",
                  border: "var(--border)",
                  borderRadius: "50%",
                  boxShadow: done || next ? "var(--pop-1)" : "none",
                  font: "700 15px/1 var(--font-mono)",
                  color: "var(--ink-900)",
                }}
              >
                {done ? <Icon name="check" size={20} /> : m.count}
              </span>
              {i < milestones.length - 1 ? (
                <span
                  style={{
                    flex: 1,
                    width: 4,
                    minHeight: compact ? 16 : 26,
                    background: done ? "var(--sun-500)" : "var(--ink-100)",
                  }}
                />
              ) : null}
            </div>
            <div style={{ paddingBottom: i < milestones.length - 1 ? (compact ? 16 : 24) : 0, flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                <span
                  style={{
                    font: "var(--type-subtitle)",
                    letterSpacing: "var(--tracking-display)",
                    color: done || next ? "var(--text-strong)" : "var(--text-muted)",
                  }}
                >
                  {m.label}
                </span>
                {done ? (
                  <Badge tone="reward" size="sm">Unlocked</Badge>
                ) : next ? (
                  <Badge tone="info" size="sm">Next</Badge>
                ) : null}
              </div>
              <div style={{ font: "var(--type-body-sm)", color: "var(--text-muted)", marginTop: 2 }}>
                {done
                  ? `Earned at visit ${m.count}`
                  : `${m.count - current} more ${m.count - current === 1 ? "visit" : "visits"}`}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
