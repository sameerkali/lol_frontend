"use client";
import React from "react";
import { useAuth } from "../../lib/auth";
import { useRouter } from "next/navigation";
import { Button } from "../../components/core/Button";
import { Card } from "../../components/core/Card";
import { Input } from "../../components/forms/Input";
import { Skeleton } from "../../components/feedback/Skeleton";
import { validateLoginForm, splitFieldErrors, type LoginFieldErrors } from "../../lib/validation";

const FIELDS = ["email", "password"] as const;

export default function BusinessLogin() {
  const { login, user, loading } = useAuth();
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [fieldErrors, setFieldErrors] = React.useState<LoginFieldErrors>({});
  const [formError, setFormError] = React.useState("");
  const [busy, setBusy] = React.useState(false);

  React.useEffect(() => {
    if (!loading && user?.role === "business") router.replace(`/business/${user.businessId}`);
  }, [user, loading, router]);

  const submit = async () => {
    setFormError("");
    const errors = validateLoginForm(email, password);
    setFieldErrors(errors);
    if (errors.email || errors.password) return;

    setBusy(true);
    try {
      await login("business", email.trim(), password);
      router.replace("/business");
    } catch (e: any) {
      const { fields, general } = splitFieldErrors(e.details, FIELDS);
      setFieldErrors(fields);
      if (general.length) setFormError(general.join(" "));
      else if (!fields.email && !fields.password) setFormError(e.message || "Login failed");
    } finally {
      setBusy(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--surface-page)", padding: 24 }}>
        <Card pad={32} style={{ width: "100%", maxWidth: 400 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 16, alignItems: "center" }}>
            <Skeleton width={120} height={44} />
            <Skeleton width={160} height={14} style={{ marginBottom: 8 }} />
            <Skeleton height={56} />
            <Skeleton height={56} />
            <Skeleton height={60} radius="var(--radius-pill)" />
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--surface-page)", padding: 24 }}>
      <Card pad={32} style={{ width: "100%", maxWidth: 400 }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ font: "900 48px/0.8 var(--font-display)", letterSpacing: "-0.03em", color: "var(--ink-900)" }}>
            lol<span style={{ color: "var(--coral-500)" }}>.</span>
          </div>
          <div style={{ font: "var(--type-label)", letterSpacing: "var(--tracking-label)", textTransform: "uppercase", color: "var(--text-muted)", marginTop: 8 }}>
            Business login
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Input
            label="Email"
            icon="mail"
            type="email"
            placeholder="you@business.com"
            value={email}
            onChange={(v) => { setEmail(v); if (fieldErrors.email) setFieldErrors((f) => ({ ...f, email: undefined })); }}
            error={fieldErrors.email}
          />
          <Input
            label="Password"
            icon="lock"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(v) => { setPassword(v); if (fieldErrors.password) setFieldErrors((f) => ({ ...f, password: undefined })); }}
            error={fieldErrors.password}
          />
          {formError && (
            <div role="alert" style={{ font: "600 14px/1.4 var(--font-body)", color: "var(--danger-ink)" }}>
              {formError}
            </div>
          )}
          <Button size="lg" fullWidth onClick={submit} disabled={busy || !email || !password}>
            {busy ? "Logging in..." : "Log in"}
          </Button>
        </div>
      </Card>
    </div>
  );
}
