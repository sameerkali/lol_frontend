"use client";
import React from "react";
import {
  Coffee, Gift, ArrowRight, Hand, Nfc, User, Cake, Phone,
  Stamp, History, Award, TrendingUp, TrendingDown, CheckCircle,
  AlertCircle, Info, Check, X, Trash2, Plus, PlusCircle, Search,
  LayoutDashboard, Flag, Users, Settings, Store, Mail,
  Sparkles, Inbox, Delete, Gift as GiftIcon, Eye, EyeOff,
  Lock, LogOut, Hash, QrCode, ChevronDown, Pencil, Copy, Download,
  Crown, Key, MoreHorizontal, ArrowLeft,
  AlertTriangle, ShieldCheck, ShieldOff,
} from "lucide-react";

function WhatsAppGlyph({ size = 24, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fill={color}
        d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"
      />
      <path
        fill={color}
        d="M12.001 2c-5.514 0-9.99 4.476-9.99 9.99 0 1.76.46 3.478 1.335 4.99L2 22l5.13-1.322a9.958 9.958 0 0 0 4.87 1.238h.004c5.514 0 9.99-4.476 9.99-9.99C21.996 6.476 17.52 2 12.001 2zm0 18.14h-.003a8.28 8.28 0 0 1-4.223-1.156l-.303-.18-3.146.812.84-3.066-.198-.315a8.27 8.27 0 0 1-1.27-4.415c0-4.575 3.726-8.3 8.306-8.3 2.219 0 4.305.865 5.874 2.435a8.246 8.246 0 0 1 2.43 5.87c0 4.575-3.727 8.3-8.307 8.3z"
      />
    </svg>
  );
}

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
  mail: Mail,
  sparkles: Sparkles,
  inbox: Inbox,
  delete: Delete,
  eye: Eye,
  "eye-off": EyeOff,
  lock: Lock,
  "log-out": LogOut,
  hash: Hash,
  "qr-code": QrCode,
  "chevron-down": ChevronDown,
  pencil: Pencil,
  copy: Copy,
  download: Download,
  crown: Crown,
  key: Key,
  "more-horizontal": MoreHorizontal,
  "arrow-left": ArrowLeft,
  "alert-triangle": AlertTriangle,
  "shield-check": ShieldCheck,
  "shield-off": ShieldOff,
  whatsapp: WhatsAppGlyph,
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
