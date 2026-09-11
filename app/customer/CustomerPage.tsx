"use client";
import React from "react";
import { usePublicBusiness, useCustomerLookup, useCustomerSignup, useCustomerCard, useCustomerHistory, useMarkVisit, useRedeem } from "../lib/queries";
import { Button } from "../components/core/Button";
import { Card } from "../components/core/Card";
import { Badge } from "../components/core/Badge";
import { Icon } from "../components/core/Icon";
import { Sticker } from "../components/core/Sticker";
import { PhoneInput } from "../components/forms/PhoneInput";
import { Input } from "../components/forms/Input";
import { PinPad } from "../components/forms/PinPad";
import { StampGrid } from "../components/loyalty/StampGrid";
import { ProgressBar } from "../components/loyalty/ProgressBar";
import { MilestoneLadder } from "../components/loyalty/MilestoneLadder";
import { RewardCard } from "../components/loyalty/RewardCard";
import { TierBadge } from "../components/loyalty/TierBadge";
import { Toast } from "../components/feedback/Toast";
import { Dialog } from "../components/feedback/Dialog";
import { Celebration } from "../components/feedback/Celebration";
import { EmptyState } from "../components/feedback/EmptyState";
import { BottomBar } from "../components/navigation/BottomBar";
import { TopBar } from "../components/navigation/TopBar";

const PHONE_STORAGE_PREFIX = "lol_phone_";

export default function CustomerPage({ slug }: { slug: string }) {
  const { data: biz, isLoading: bizLoading } = usePublicBusiness(slug);
  const storageKey = `${PHONE_STORAGE_PREFIX}${slug}`;

  const [screen, setScreen] = React.useState<"lookup" | "signup" | "card">("lookup");
  const [autoChecking, setAutoChecking] = React.useState(true);
  const [tab, setTab] = React.useState("card");
  const [phone, setPhone] = React.useState("");
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [birthdayDate, setBirthdayDate] = React.useState("");
  const [pinOpen, setPinOpen] = React.useState(false);
  const [pinMode, setPinMode] = React.useState<string>("visit");
  const [pin, setPin] = React.useState("");
  const [pinError, setPinError] = React.useState("");
  const [celebrate, setCelebrate] = React.useState<any>(null);
  const [toast, setToast] = React.useState("");
  const [selectedReward, setSelectedReward] = React.useState<any>(null);

  const lookupMut = useCustomerLookup(slug);
  const signupMut = useCustomerSignup(slug);
  const visitMut = useMarkVisit(slug);
  const redeemMut = useRedeem(slug);

  const { data: cardData, refetch: refetchCard } = useCustomerCard(slug, screen === "card" ? phone : "");
  const { data: historyData } = useCustomerHistory(slug, screen === "card" ? phone : "");

  const showToast = (t: string) => { setToast(t); setTimeout(() => setToast(""), 2200); };

  // Returning customer: if this browser already found a card on this
  // business's page before, skip straight past phone entry instead of
  // asking again every single visit.
  React.useEffect(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem(storageKey) : null;
    if (!saved) {
      setAutoChecking(false);
      return;
    }
    setPhone(saved);
    lookupMut
      .mutateAsync(saved)
      .then((res) => {
        if (res.exists) setScreen("card");
        else setScreen("signup");
      })
      .catch(() => {
        localStorage.removeItem(storageKey);
      })
      .finally(() => setAutoChecking(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey]);

  const switchNumber = () => {
    localStorage.removeItem(storageKey);
    setPhone("");
    setName("");
    setEmail("");
    setBirthdayDate("");
    setScreen("lookup");
  };

  const milestones = biz?.milestones || [];
  const card = cardData?.card || cardData;
  const history = historyData?.history || historyData || [];
  const visits = card?.count || 0;
  const totalTarget = milestones.length ? milestones[milestones.length - 1].count : 15;
  const nextMs = milestones.find((m: any) => m.count > visits) || milestones[milestones.length - 1] || { count: totalTarget, label: "Reward" };
  const unlocked = card?.milestonesUnlocked || [];

  const openPin = (mode: string, reward?: any) => {
    setPinMode(mode);
    setSelectedReward(reward || null);
    setPin("");
    setPinError("");
    setPinOpen(true);
  };

  const completePin = async (v: string) => {
    if (pinMode === "visit") {
      try {
        const res = await visitMut.mutateAsync({ phone, pin: biz?.checkInMode === "pin" ? v : undefined });
        setPinOpen(false);
        setPin("");
        if (res.newlyUnlocked?.length) {
          setCelebrate(res.newlyUnlocked[0]);
        } else {
          showToast(res.note || "Visit marked");
        }
      } catch (e: any) {
        setPinError(e.message || "Failed");
        setPin("");
      }
    } else if (pinMode === "redeem" && selectedReward) {
      try {
        await redeemMut.mutateAsync({ phone, milestoneUnlockedId: selectedReward._id || selectedReward.id, pin: v });
        setPinOpen(false);
        setPin("");
        setSelectedReward(null);
        showToast("Reward redeemed");
      } catch (e: any) {
        setPinError(e.message || "PIN didn't match");
        setPin("");
      }
    }
  };

  const handleLookup = async () => {
    if (phone.length < 10) return;
    try {
      const res = await lookupMut.mutateAsync(phone);
      localStorage.setItem(storageKey, phone);
      if (res.exists) {
        setScreen("card");
      } else {
        setScreen("signup");
      }
    } catch (e: any) {
      showToast(e.message || "Lookup failed");
    }
  };

  const handleSignup = async () => {
    try {
      const birthday = birthdayDate ? birthdayDate.slice(5) : undefined; // "YYYY-MM-DD" -> "MM-DD"
      await signupMut.mutateAsync({
        phone,
        name: biz.signupFields?.name ? name || undefined : undefined,
        email: biz.signupFields?.email ? email || undefined : undefined,
        birthday: biz.signupFields?.birthday ? birthday : undefined,
      });
      localStorage.setItem(storageKey, phone);
      setScreen("card");
    } catch (e: any) {
      showToast(e.message || "Signup failed");
    }
  };

  if (bizLoading || autoChecking) {
    return (
      <div className="lol-page-center">
        <div className="lol-customer-frame" style={{ alignItems: "center", justifyContent: "center" }}>
          <div style={{ font: "var(--type-body)", color: "var(--text-muted)" }}>Loading...</div>
        </div>
      </div>
    );
  }
  if (!biz) {
    return (
      <div className="lol-page-center">
        <div style={{ font: "var(--type-body)", color: "var(--text-muted)" }}>Business not found.</div>
      </div>
    );
  }

  const Logo = <span style={{ font: "900 22px/1 var(--font-display)", color: "var(--ink-900)" }}>{(biz.name || "??").substring(0, 2).toUpperCase()}</span>;

  const Lookup = (
    <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 20, flex: 1 }}>
      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <Badge tone="info" icon="nfc">Tag tapped</Badge>
        <Badge tone="neutral">{biz.name}</Badge>
      </div>
      <div>
        <h1 style={{ margin: 0, font: "var(--type-display)", fontSize: 58, letterSpacing: "var(--tracking-display)", color: "var(--text-strong)" }}>
          Your card lives on your phone number.
        </h1>
        <p style={{ font: "var(--type-body-lg)", color: "var(--text-muted)", marginTop: 10 }}>
          No app. No password. Type your number and we&apos;ll find your stamps.
        </p>
      </div>
      <PhoneInput value={phone} onChange={setPhone} hint="Used only to find your card." />
      <Button size="lg" fullWidth icon={<Icon name="arrow-right" size={21} />} wobble onClick={handleLookup} disabled={lookupMut.isPending || phone.length < 10}>
        {lookupMut.isPending ? "Finding..." : "Find my card"}
      </Button>
    </div>
  );

  const signupFields = biz.signupFields || {};
  const Signup = (
    <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 18, flex: 1 }}>
      <div>
        <h1 style={{ margin: 0, font: "var(--type-title)", fontSize: 42, letterSpacing: "var(--tracking-display)", color: "var(--text-strong)" }}>Start your card</h1>
        <p style={{ font: "var(--type-body)", color: "var(--text-muted)", marginTop: 6 }}>
          {signupFields.name ? `${biz.name} asks for a name. ` : ""}Everything else is optional.
        </p>
      </div>
      {biz.headStart?.enabled && biz.headStart.stamps > 0 && (
        <Card tone="mint" pad={16} elevation={1}>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <Sticker color="var(--paper-000)" size={48} tilt={-6}><Icon name="gift" size={22} /></Sticker>
            <div>
              <div style={{ font: "var(--type-subtitle)", color: "var(--text-strong)" }}>{biz.headStart.stamps} free stamps to start</div>
              <div style={{ font: "var(--type-body-sm)", color: "var(--text-body)" }}>A head start from the cafe.</div>
            </div>
          </div>
        </Card>
      )}
      {signupFields.name && <Input label="Name" icon="user" value={name} onChange={setName} placeholder="Priya" />}
      {signupFields.email && <Input label="Email" icon="mail" type="email" value={email} onChange={setEmail} placeholder="priya@email.com" />}
      {signupFields.birthday && <Input label="Birthday" icon="cake" type="date" value={birthdayDate} onChange={setBirthdayDate} />}
      <Button size="lg" fullWidth onClick={handleSignup} disabled={signupMut.isPending}>
        {signupMut.isPending ? "Creating..." : "Create my card"}
      </Button>
    </div>
  );

  const CardTab = (
    <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 22 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
        <div>
          <div style={{ font: "var(--type-label)", letterSpacing: "var(--tracking-label)", textTransform: "uppercase", color: "var(--text-muted)" }}>Your card</div>
          <div style={{ font: "var(--type-title)", fontSize: 40, letterSpacing: "var(--tracking-display)", color: "var(--text-strong)" }}>{card?.name || "Card"}</div>
        </div>
        {card?.tierName && <TierBadge tier={card.tierName} size="sm" />}
      </div>
      <Card pad={20}>
        <StampGrid total={totalTarget} filled={visits} milestones={milestones.map((m: any) => m.count)} glyph="coffee" columns={5} size={52} />
        <div style={{ marginTop: 20 }}>
          <ProgressBar value={visits} max={nextMs?.count || totalTarget} label={`Next: ${nextMs?.label || "Reward"}`} />
        </div>
        <div style={{ font: "var(--type-body-lg)", color: "var(--text-strong)", marginTop: 12, fontWeight: 600 }}>
          {Math.max(0, (nextMs?.count || totalTarget) - visits)} more {(nextMs?.count || totalTarget) - visits === 1 ? "visit" : "visits"} to {(nextMs?.label || "reward").toLowerCase()}.
        </div>
      </Card>
      {milestones.length > 0 && (
        <div>
          <div style={{ font: "var(--type-label)", letterSpacing: "var(--tracking-label)", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 12 }}>Milestone ladder</div>
          <MilestoneLadder milestones={milestones.map((m: any) => ({ count: m.count, label: m.label }))} current={visits} compact />
        </div>
      )}
      <button
        type="button"
        onClick={switchNumber}
        style={{ background: "transparent", border: 0, padding: 0, cursor: "pointer", font: "600 13px/1 var(--font-body)", color: "var(--text-muted)", textDecoration: "underline", alignSelf: "center", marginTop: 4 }}
      >
        Not you? Use a different number
      </button>
    </div>
  );

  const RewardsTab = (
    <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ font: "var(--type-title)", fontSize: 36, letterSpacing: "var(--tracking-display)", color: "var(--text-strong)" }}>Your rewards</div>
      {unlocked.length === 0 ? (
        <EmptyState icon="gift" title="Nothing unlocked yet" body={`Your first reward lands at ${milestones[0]?.count || 5} visits.`} />
      ) : (
        unlocked.map((r: any, i: number) => (
          <RewardCard
            key={r._id || i}
            title={r.label || "Reward"}
            detail={r.redeemedAt ? "Redeemed at the counter" : `Unlocked at visit ${r.count || "?"}`}
            state={r.redeemedAt ? "redeemed" : "unlocked"}
            onRedeem={() => !r.redeemedAt && openPin("redeem", r)}
          />
        ))
      )}
      <div style={{ font: "var(--type-body-sm)", color: "var(--text-muted)", marginTop: 4 }}>
        Redeeming always needs the cafe&apos;s PIN. Hand the phone over at the counter.
      </div>
    </div>
  );

  const HistoryTab = (
    <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ font: "var(--type-title)", fontSize: 36, letterSpacing: "var(--tracking-display)", color: "var(--text-strong)" }}>History</div>
      {history.length === 0 ? (
        <EmptyState icon="history" title="No history yet" body="Your visits will appear here." />
      ) : (
        history.map((r: any, i: number) => (
          <div key={r._id || i} style={{ display: "flex", gap: 14, alignItems: "center", padding: "12px 14px", background: "var(--paper-000)", border: "var(--border-hair)", borderRadius: "var(--radius-md)" }}>
            <span style={{ width: 38, height: 38, display: "grid", placeItems: "center", background: r.type === "visit" ? "var(--grape-100)" : "var(--sun-100)", border: "var(--border-hair)", borderRadius: "50%" }}>
              <Icon name={r.type === "visit" ? "stamp" : "gift"} size={18} />
            </span>
            <span style={{ flex: 1, font: "600 15px/1.3 var(--font-body)", color: "var(--text-strong)" }}>{r.type === "visit" ? "Visit marked" : "Reward redeemed"}</span>
            <span style={{ font: "var(--type-mono)", color: "var(--text-muted)" }}>{r.createdAt ? new Date(r.createdAt).toLocaleDateString() : "—"}</span>
          </div>
        ))
      )}
    </div>
  );

  const body = screen === "lookup" ? Lookup : screen === "signup" ? Signup : tab === "card" ? CardTab : tab === "rewards" ? RewardsTab : HistoryTab;

  return (
    <div className="lol-page-center">
      <div className="lol-customer-frame">
        <TopBar title={biz.name} subtitle={biz.location || ""} logo={Logo} right={screen !== "lookup" ? <Badge tone="neutral" size="sm">{visits} visits</Badge> : null} tone={biz.branding?.primaryColor || "var(--grape-500)"} />
        <div style={{ flex: 1, overflowY: "auto" }}>{body}</div>
        {screen === "card" && tab === "card" && biz.checkInMode !== "automatic" && (
          <div style={{ padding: "14px 20px 16px", borderTop: "var(--border)", background: "var(--paper-000)" }}>
            <Button size="lg" fullWidth icon={<Icon name="hand" size={21} />} onClick={() => openPin("visit")} disabled={visitMut.isPending}>
              Mark my visit
            </Button>
          </div>
        )}
        {screen === "card" && biz.checkInMode === "automatic" && (
          <div style={{ padding: "14px 20px 16px", borderTop: "var(--border)", background: "var(--paper-000)" }}>
            <Button size="lg" fullWidth icon={<Icon name="hand" size={21} />} onClick={async () => { try { const res = await visitMut.mutateAsync({ phone }); if (res.newlyUnlocked?.length) setCelebrate(res.newlyUnlocked[0]); else showToast(res.note || "Visit marked"); } catch (e: any) { showToast(e.message || "Failed"); } }} disabled={visitMut.isPending}>
              Mark my visit
            </Button>
          </div>
        )}
        {screen === "card" && (
          <BottomBar value={tab} onChange={setTab} items={[{ value: "card", label: "Card", icon: "stamp" }, { value: "rewards", label: "Rewards", icon: "gift" }, { value: "history", label: "History", icon: "history" }]} />
        )}
        {toast && <div style={{ position: "absolute", left: 0, right: 0, bottom: 150, display: "grid", placeItems: "center", zIndex: 30 }}><Toast tone="success">{toast}</Toast></div>}
        <Dialog open={pinOpen} title="" onClose={() => setPinOpen(false)} width={380}>
          <PinPad value={pin} onChange={(v) => { setPin(v); setPinError(""); }} onComplete={completePin} error={pinError} subtitle={pinMode === "visit" ? "Staff confirms your visit." : "Staff confirms the reward."} />
        </Dialog>
        <Celebration open={!!celebrate} title={celebrate?.label ? `${celebrate.label} unlocked!` : "Reward unlocked!"} subtitle="Show this to the counter whenever you like." onDismiss={() => { setCelebrate(null); setTab("rewards"); }} />
      </div>
    </div>
  );
}
