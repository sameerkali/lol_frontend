"use client";
import React from "react";

const SHAPES: Record<string, string> = {
  circle: "50%",
  pill: "var(--radius-pill)",
  squircle: "var(--radius-md)",
};

export function Sticker({
  children,
  color = "var(--sun-500)",
  shape = "circle",
  size = 72,
  tilt = -8,
  pop = false,
  style,
}: {
  children: React.ReactNode;
  color?: string;
  shape?: string;
  size?: number;
  tilt?: number;
  pop?: boolean;
  style?: React.CSSProperties;
}) {
  return (
    <span
      style={{
        display: "grid",
        placeItems: "center",
        width: shape === "pill" ? undefined : size,
        height: size,
        padding: shape === "pill" ? "0 20px" : 0,
        background: color,
        border: "var(--border)",
        borderRadius: SHAPES[shape],
        boxShadow: "var(--pop-2)",
        transform: `rotate(${tilt}deg)`,
        font: "800 20px/1 var(--font-display)",
        color: "var(--ink-900)",
        animation: pop ? "lol-pop-in var(--dur-slow) var(--ease-pop) both" : undefined,
        ...style,
      }}
    >
      {children}
    </span>
  );
}
