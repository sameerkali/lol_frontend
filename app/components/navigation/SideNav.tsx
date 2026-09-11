"use client";
import React from "react";
import { Icon } from "../core/Icon";

interface SideNavProps {
  items: { value: string; label: string; icon: string }[];
  value?: string;
  onChange?: (v: string) => void;
  brand?: string;
  footer?: React.ReactNode;
  style?: React.CSSProperties;
}

function NavButton({
  item,
  active,
  onClick,
  style,
}: {
  item: { value: string; label: string; icon: string };
  active: boolean;
  onClick?: () => void;
  style?: React.CSSProperties;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        width: "100%",
        padding: "12px 14px",
        minHeight: 48,
        textAlign: "left",
        cursor: "pointer",
        background: active ? "var(--grape-500)" : "transparent",
        color: active ? "var(--paper-000)" : "var(--ink-300)",
        border: active ? "3px solid var(--paper-000)" : "3px solid transparent",
        borderRadius: "var(--radius-pill)",
        font: "var(--type-button)",
        transition: "all var(--dur-fast) var(--ease-out)",
        ...style,
      }}
    >
      <Icon name={item.icon} size={20} />
      {item.label}
    </button>
  );
}

export function SideNav({ items = [], value, onChange, brand = "lol", footer, style }: SideNavProps) {
  const [open, setOpen] = React.useState(false);

  const select = (v: string) => {
    onChange && onChange(v);
    setOpen(false);
  };

  return (
    <>
      {/* Desktop: fixed left sidebar */}
      <nav
        className="lol-sidenav-desktop"
        style={{
          width: 240,
          flex: "0 0 auto",
          display: "flex",
          flexDirection: "column",
          gap: 6,
          padding: 20,
          boxSizing: "border-box",
          background: "var(--ink-900)",
          borderRight: "var(--border)",
          ...style,
        }}
      >
        <div style={{ font: "900 44px/0.8 var(--font-display)", letterSpacing: "-0.03em", color: "var(--paper-000)", marginBottom: 20 }}>
          {brand}
          <span style={{ color: "var(--coral-500)" }}>.</span>
        </div>
        {items.map((it) => (
          <NavButton key={it.value} item={it} active={it.value === value} onClick={() => select(it.value)} />
        ))}
        <div style={{ marginTop: "auto" }}>{footer}</div>
      </nav>

      {/* Mobile: top bar with a slide-down drawer, hidden on desktop via CSS */}
      <nav className="lol-sidenav-mobile" style={{ flexDirection: "column", position: "relative", zIndex: 50 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "12px 16px",
            background: "var(--ink-900)",
            borderBottom: "var(--border)",
            minHeight: 56,
            boxSizing: "border-box",
          }}
        >
          <div style={{ font: "900 30px/0.8 var(--font-display)", letterSpacing: "-0.03em", color: "var(--paper-000)" }}>
            {brand}
            <span style={{ color: "var(--coral-500)" }}>.</span>
          </div>
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 44,
              height: 44,
              background: "var(--ink-700)",
              border: "var(--border-hair)",
              borderRadius: "var(--radius-sm)",
              cursor: "pointer",
              color: "var(--paper-000)",
            }}
          >
            <Icon name={open ? "x" : "more-horizontal"} size={22} />
          </button>
        </div>

        {open && (
          <>
            <div
              onClick={() => setOpen(false)}
              style={{ position: "fixed", inset: 0, background: "rgba(27,21,38,0.4)", zIndex: 49 }}
            />
            <div
              style={{
                position: "absolute",
                top: "100%",
                left: 0,
                right: 0,
                background: "var(--ink-900)",
                borderBottom: "var(--border)",
                boxShadow: "var(--pop-2)",
                padding: 16,
                display: "flex",
                flexDirection: "column",
                gap: 6,
                zIndex: 50,
                maxHeight: "80vh",
                overflowY: "auto",
              }}
            >
              {items.map((it) => (
                <NavButton key={it.value} item={it} active={it.value === value} onClick={() => select(it.value)} />
              ))}
              <div style={{ borderTop: "var(--border-hair)", marginTop: 8, paddingTop: 12 }}>{footer}</div>
            </div>
          </>
        )}
      </nav>
    </>
  );
}
