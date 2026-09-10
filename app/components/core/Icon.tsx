"use client";
import React from "react";
import {
  Coffee, Gift, ArrowRight, Hand, Nfc, User, Cake, Phone,
  Stamp, History, Award, TrendingUp, TrendingDown, CheckCircle,
  AlertCircle, Info, Check, X, Trash2, Plus, PlusCircle, Search,
  LayoutDashboard, Flag, Users, Settings, Store, MapPin, Mail,
  CreditCard, Sparkles, Inbox, Delete, Gift as GiftIcon,
} from "lucide-react";

const ICON_MAP: Record<string, React.ComponentType<any>> = {
  coffee: Coffee,
  gift: Gift,
  "arrow-right": ArrowRight,
  hand: Hand,
  nfc: Nfc,
  user: User,
  cake: Cake,
  phone: Phone,
  stamp: Stamp,
  history: History,
  award: Award,
  "trending-up": TrendingUp,
  "trending-down": TrendingDown,
  "check-circle": CheckCircle,
  "alert-circle": AlertCircle,
  info: Info,
  check: Check,
  x: X,
  "trash-2": Trash2,
  plus: Plus,
  "plus-circle": PlusCircle,
  search: Search,
  "layout-dashboard": LayoutDashboard,
  flag: Flag,
  users: Users,
  settings: Settings,
  store: Store,
  "map-pin": MapPin,
  mail: Mail,
  "credit-card": CreditCard,
  sparkles: Sparkles,
  inbox: Inbox,
  delete: Delete,
};

export function Icon({
  name,
  size = 24,
  color = "currentColor",
  strokeWidth = 2.25,
  style,
}: {
  name: string;
  size?: number;
  color?: string;
  strokeWidth?: number;
  style?: React.CSSProperties;
}) {
  const Comp = ICON_MAP[name];
  if (!Comp) return null;
  return (
    <span style={{ display: "inline-flex", width: size, height: size, flex: "0 0 auto", ...style }}>
      <Comp size={size} color={color} strokeWidth={strokeWidth} />
    </span>
  );
}
