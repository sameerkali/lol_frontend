"use client";
import React from "react";

export function Skeleton({
  width = "100%",
  height = 16,
  radius = 8,
  style,
}: {
  width?: number | string;
  height?: number | string;
  radius?: number | string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      style={{
        width,
        height,
        borderRadius: radius,
        flex: "0 0 auto",
        background: "linear-gradient(100deg, var(--paper-200) 30%, var(--paper-000) 50%, var(--paper-200) 70%)",
        backgroundSize: "300% 100%",
        animation: "lol-shine 1.6s ease-in-out infinite",
        ...style,
      }}
    />
  );
}

export function SkeletonCircle({ size = 40, style }: { size?: number; style?: React.CSSProperties }) {
  return <Skeleton width={size} height={size} radius="50%" style={style} />;
}

export function SkeletonRow({ columns = 4 }: { columns?: number }) {
  return (
    <div style={{ display: "flex", gap: 20, alignItems: "center", padding: "16px 20px", borderBottom: "var(--border-hair)" }}>
      <SkeletonCircle size={34} />
      {Array.from({ length: columns }).map((_, i) => (
        <Skeleton key={i} height={14} style={{ flex: 1 }} />
      ))}
    </div>
  );
}

export function SkeletonStatRow({ count = 4 }: { count?: number }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${count}, 1fr)`, gap: 16 }}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} style={{ background: "var(--paper-000)", border: "var(--border)", borderRadius: "var(--radius-lg)", boxShadow: "var(--pop-1)", padding: 20, display: "flex", flexDirection: "column", gap: 12 }}>
          <Skeleton width="60%" height={11} />
          <Skeleton width="40%" height={30} />
        </div>
      ))}
    </div>
  );
}

/** Full-page loading gate shaped like the sidebar + content panel layout, shown while auth/session resolves so the first paint is never a blank screen. */
export function PanelSkeleton({ navItems = 4 }: { navItems?: number }) {
  return (
    <div style={{ display: "flex", height: "100vh", background: "var(--surface-page)" }}>
      <div style={{ width: 240, flex: "0 0 auto", padding: 20, background: "var(--ink-900)", display: "flex", flexDirection: "column", gap: 10 }}>
        <Skeleton width={90} height={36} radius={8} style={{ background: "linear-gradient(100deg, var(--ink-700) 30%, var(--ink-500) 50%, var(--ink-700) 70%)", backgroundSize: "300% 100%", marginBottom: 20 }} />
        {Array.from({ length: navItems }).map((_, i) => (
          <Skeleton key={i} height={48} radius="var(--radius-pill)" style={{ background: "linear-gradient(100deg, var(--ink-700) 30%, var(--ink-500) 50%, var(--ink-700) 70%)", backgroundSize: "300% 100%" }} />
        ))}
      </div>
      <div style={{ flex: 1, padding: 32, display: "flex", flexDirection: "column", gap: 28, maxWidth: "var(--width-panel)" }}>
        <Skeleton width={160} height={12} />
        <Skeleton width={280} height={34} />
        <SkeletonStatRow />
        <div style={{ background: "var(--paper-000)", border: "var(--border)", borderRadius: "var(--radius-lg)", boxShadow: "var(--pop-1)", overflow: "hidden" }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <SkeletonRow key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
  return (
    <div style={{ background: "var(--paper-000)", border: "var(--border)", borderRadius: "var(--radius-lg)", boxShadow: "var(--pop-1)", overflow: "hidden" }}>
      {Array.from({ length: rows }).map((_, i) => (
        <SkeletonRow key={i} columns={columns} />
      ))}
    </div>
  );
}
