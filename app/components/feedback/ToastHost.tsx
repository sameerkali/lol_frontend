"use client";
import React from "react";
import { Toast } from "./Toast";
import { Icon } from "../core/Icon";
import { subscribeToast, type ToastEvent } from "../../lib/toastBus";

const AUTO_DISMISS_MS = 5000;

export function ToastHost() {
  const [toasts, setToasts] = React.useState<ToastEvent[]>([]);

  React.useEffect(() => {
    return subscribeToast((event) => {
      setToasts((prev) => [...prev, event]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== event.id));
      }, AUTO_DISMISS_MS);
    });
  }, []);

  const dismiss = (id: number) => setToasts((prev) => prev.filter((t) => t.id !== id));

  if (toasts.length === 0) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 24,
        right: 24,
        zIndex: 1000,
        display: "flex",
        flexDirection: "column",
        gap: 10,
        maxWidth: "calc(100vw - 48px)",
      }}
    >
      {toasts.map((t) => (
        <Toast key={t.id} tone={t.tone} style={{ cursor: "pointer" }}>
          <span onClick={() => dismiss(t.id)} style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {t.text}
            <Icon name="x" size={15} />
          </span>
        </Toast>
      ))}
    </div>
  );
}
