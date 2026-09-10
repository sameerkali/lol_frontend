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
      })
      .catch(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
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
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setUser(null);
  }, []);

  return <Ctx.Provider value={{ user, loading, login, logout }}>{children}</Ctx.Provider>;
}

export const useAuth = () => useContext(Ctx);
