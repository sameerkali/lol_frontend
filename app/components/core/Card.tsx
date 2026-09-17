"use client";
import React from "react";

const TONES: Record<string, React.CSSProperties> = {
  paper: { background: "var(--surface-card)" },
  sunk: { background: "var(--surface-sunk)", boxShadow: "none" },
  grape: { background: "var(--grape-100)" },
  mint: { background: "var(--mint-100)" },
  sun: { background: "var(--sun-100)" },
};

export function Card({
  children,
  tone = "paper",
  pad = 24,
  elevation = 2,
  style,
}: {
  children: React.ReactNode;
  tone?: string;
  pad?: number;
  elevation?: number;
  style?: React.CSSProperties;
}) {
  const pop: Record<number, string> = { 0: "none", 1: "var(--pop-1)", 2: "var(--pop-2)", 3: "var(--pop-3)" };
  return (
    <div
      style={{
        background: "var(--surface-card)",
        border: "var(--border)",
        borderRadius: "var(--radius-lg)",
        boxShadow: pop[elevation],
        padding: pad,
        boxSizing: "border-box",
        ...TONES[tone],
        ...style,
      }}
    >
      {children}
    </div>
  );
}
