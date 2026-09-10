"use client";
import React from "react";
import { useAuth } from "../../lib/auth";
import { useRouter } from "next/navigation";
import { Button } from "../../components/core/Button";
import { Card } from "../../components/core/Card";
import { Input } from "../../components/forms/Input";

export default function AdminLogin() {
  const { login, user, loading } = useAuth();
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const [busy, setBusy] = React.useState(false);

  React.useEffect(() => {
    if (!loading && user?.role === "admin") router.replace("/admin");
  }, [user, loading, router]);

  const submit = async () => {
    setError("");
    setBusy(true);
    try {
      await login("admin", email, password);
      router.replace("/admin");
    } catch (e: any) {
      setError(e.message || "Login failed");
    } finally {
      setBusy(false);
    }
  };

  if (loading) return null;

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--surface-page)", padding: 24 }}>
      <Card pad={32} style={{ width: "100%", maxWidth: 400 }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ font: "900 48px/0.8 var(--font-display)", letterSpacing: "-0.03em", color: "var(--ink-900)" }}>
            lol<span style={{ color: "var(--coral-500)" }}>.</span>
          </div>
          <div style={{ font: "var(--type-label)", letterSpacing: "var(--tracking-label)", textTransform: "uppercase", color: "var(--text-muted)", marginTop: 8 }}>
            Admin login
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Input label="Email" icon="mail" type="email" placeholder="admin@expendifii.com" value={email} onChange={setEmail} />
          <Input label="Password" icon="lock" type="password" placeholder="Password" value={password} onChange={setPassword} />
          {error && <div style={{ font: "600 14px/1.4 var(--font-body)", color: "var(--danger-ink)" }}>{error}</div>}
          <Button size="lg" fullWidth onClick={submit} disabled={busy || !email || !password}>
            {busy ? "Logging in..." : "Log in"}
          </Button>
        </div>
      </Card>
    </div>
  );
}
