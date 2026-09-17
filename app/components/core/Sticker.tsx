"use client";
import React from "react";

export function Sticker({
  children,
  color = "var(--sun-500)",
  size = 72,
  tilt = -8,
  style,
}: {
  children: React.ReactNode;
  color?: string;
  size?: number;
  tilt?: number;
  style?: React.CSSProperties;
}) {
  return (
    <span
      style={{
        display: "grid",
        placeItems: "center",
        width: size,
        height: size,
        background: color,
        border: "var(--border)",
        borderRadius: "50%",
        boxShadow: "var(--pop-2)",
        transform: `rotate(${tilt}deg)`,
        font: "800 20px/1 var(--font-display)",
        color: "var(--ink-900)",
        ...style,
      }}
    >
      {children}
    </span>
  );
}
