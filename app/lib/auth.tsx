"use client";
import React, { createContext, useContext, useState, useCallback } from "react";
import { api } from "./api";

type Role = "admin" | "business";
interface AuthUser {
  id: string;
  name?: string;
  email: string;
  role: Role;
  businessId?: string;
}
interface AuthCtx {
  user: AuthUser | null;
  loading: boolean;
  login: (role: Role, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const Ctx = createContext<AuthCtx>(null!);

// Non-sensitive role flag mirrored into a readable cookie (never the JWT itself) so
// proxy.ts can do an optimistic, pre-render redirect for /admin and /business routes.
// This is a UX/defense-in-depth improvement only — the API remains the real
// authorization boundary via the bearer token on every request.
const SESSION_COOKIE = "lol_session";
const SESSION_COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

function setSessionCookie(role: Role) {
  if (typeof document === "undefined") return;
  document.cookie = `${SESSION_COOKIE}=${role}; path=/; max-age=${SESSION_COOKIE_MAX_AGE}; samesite=lax`;
}

function clearSessionCookie() {
  if (typeof document === "undefined") return;
  document.cookie = `${SESSION_COOKIE}=; path=/; max-age=0; samesite=lax`;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role") as Role | null;
    if (!token || !role) { setLoading(false); return; }

    const path = role === "admin" ? "/admin/auth/me" : "/business/me";
    api.get<any>(path)
      .then((d) => {
        const u = role === "admin" ? (d.admin || d) : (d.business || d);
        setUser({
          id: u._id || u.id,
          name: u.name,
          email: u.email || u.owner?.email || "",
          role,
          businessId: u._id || u.id,
        });
        setSessionCookie(role);
      })
      .catch(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        clearSessionCookie();
      })
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (role: Role, email: string, password: string) => {
    const path = role === "admin" ? "/admin/auth/login" : "/business/auth/login";
    const d = await api.post<{ token: string; admin?: any; business?: any }>(path, { email, password });
    localStorage.setItem("token", d.token);
    localStorage.setItem("role", role);
    const u = role === "admin" ? d.admin : d.business;
    setUser({
      id: u._id || u.id,
      name: u.name,
      email: u.email || u.owner?.email || "",
      role,
      businessId: u._id || u.id,
    });
    setSessionCookie(role);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    clearSessionCookie();
    setUser(null);
  }, []);

  return <Ctx.Provider value={{ user, loading, login, logout }}>{children}</Ctx.Provider>;
}

export const useAuth = () => useContext(Ctx);
