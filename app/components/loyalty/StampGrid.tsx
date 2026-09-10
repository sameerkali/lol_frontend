"use client";
import React from "react";
import { Icon } from "../core/Icon";

export function StampGrid({
  total = 10,
  filled = 0,
  milestones = [],
  glyph = "coffee",
  columns = 5,
  size = 58,
  animateFrom = null,
}: {
  total?: number;
  filled?: number;
  milestones?: number[];
  glyph?: string;
  columns?: number;
  size?: number;
  animateFrom?: number | null;
}) {
  const isMilestone = (n: number) => milestones.includes(n);
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: 12,
        justifyItems: "center",
      }}
    >
      {Array.from({ length: total }).map((_, i) => {
        const n = i + 1;
        const done = n <= filled;
        const next = n === filled + 1;
        const ms = isMilestone(n);
        const bg = done
          ? ms
            ? "var(--sun-500)"
            : "var(--grape-500)"
          : next
            ? "var(--mint-300)"
            : ms
              ? "var(--sun-100)"
              : "var(--paper-200)";
        const fg = done && !ms ? "var(--paper-000)" : "var(--ink-900)";
        const animate = animateFrom !== null && n > animateFrom && n <= filled;
        return (
          <span
            key={n}
            title={ms ? `Milestone at ${n}` : `Visit ${n}`}
            style={{
              width: size,
              height: size,
              display: "grid",
              placeItems: "center",
              background: bg,
              color: fg,
              border: "var(--border)",
              borderRadius: "50%",
              boxShadow: done ? "var(--pop-1)" : "none",
              borderStyle: !done && !ms ? "dashed" : "solid",
              animation: animate
                ? "lol-pop-in var(--dur-slow) var(--ease-pop) both"
                : undefined,
              animationDelay: animate
                ? `${(n - animateFrom - 1) * 110}ms`
                : undefined,
            }}
          >
            {done ? (
              <Icon name={ms ? "gift" : glyph} size={Math.round(size * 0.45)} />
            ) : (
              <span
                style={{
                  font: `700 ${Math.round(size * 0.3)}px/1 var(--font-mono)`,
                  color: "var(--ink-300)",
                }}
              >
                {n}
              </span>
            )}
          </span>
        );
      })}
    </div>
  );
}
