"use client";
import React from "react";
import { Icon } from "../core/Icon";
import { Badge } from "../core/Badge";
import { Button } from "../core/Button";

export function RewardCard({
  title,
  detail,
  state = "unlocked",
  onRedeem,
  style,
}: {
  title: string;
  detail?: string;
  state?: "unlocked" | "redeemed";
  onRedeem?: () => void;
  style?: React.CSSProperties;
}) {
  const redeemed = state === "redeemed";
  return (
    <div
      style={{
        background: redeemed ? "var(--paper-200)" : "var(--sun-100)",
        border: "var(--border)",
        borderRadius: "var(--radius-lg)",
        boxShadow: redeemed ? "none" : "var(--pop-2)",
        padding: 20,
        display: "flex",
        gap: 16,
        alignItems: "center",
        ...style,
      }}
    >
      <span
        style={{
          width: 56,
          height: 56,
          flex: "0 0 auto",
          display: "grid",
          placeItems: "center",
          background: redeemed ? "var(--ink-100)" : "var(--sun-500)",
          border: "var(--border)",
          borderRadius: "50%",
        }}
      >
        <Icon name={redeemed ? "check" : "gift"} size={26} />
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          <span style={{ font: "var(--type-subtitle)", letterSpacing: "var(--tracking-display)", color: "var(--text-strong)" }}>
            {title}
          </span>
          <Badge tone={redeemed ? "neutral" : "reward"} size="sm">
            {redeemed ? "Redeemed" : "Unlocked"}
          </Badge>
        </div>
        {detail ? (
          <div style={{ font: "var(--type-body-sm)", color: "var(--text-muted)", marginTop: 2 }}>
            {detail}
          </div>
        ) : null}
      </div>
      {!redeemed && onRedeem ? (
        <Button variant="reward" size="sm" onClick={onRedeem}>
          Redeem
        </Button>
      ) : null}
    </div>
  );
}
