"use client";
import React from "react";
import { Button } from "../components/core/Button";
import { Card } from "../components/core/Card";
import { Icon } from "../components/core/Icon";
import { Input } from "../components/forms/Input";
import { Select } from "../components/forms/Select";
import { Switch } from "../components/forms/Switch";

export const REWARD_TYPE_OPTIONS = [
  { value: "free_item", label: "Free item" },
  { value: "percent_off", label: "% off the bill" },
  { value: "flat_off", label: "Flat ₹ off" },
  { value: "custom", label: "Custom reward" },
];

export const EARNING_MODE_OPTIONS = [
  { value: "visits", label: "Visits only — 1 visit = 1 stamp" },
  { value: "bill_amount", label: "Bill amount — points per ₹ spent" },
  { value: "visits_with_min_bill", label: "Visits with a minimum bill" },
];

export const CHECK_IN_MODE_OPTIONS = [
  { value: "automatic", label: "Automatic — no confirmation needed" },
  { value: "pin", label: "Business PIN — staff confirms every visit" },
];

export const AFTER_FINAL_OPTIONS = [
  { value: "reset", label: "Reset the card" },
  { value: "next_tier", label: "Move to the next tier" },
];

function rewardPlaceholder(rewardType: string) {
  if (rewardType === "percent_off") return "e.g. 20";
  if (rewardType === "flat_off") return "e.g. 100";
  if (rewardType === "free_item") return "e.g. Free coffee";
  return "e.g. Free dessert";
}

function emptyMilestone() {
  return { count: 1, rewardType: "custom", rewardValue: "", label: "" };
}

const trashBtnStyle: React.CSSProperties = {
  width: 40,
  height: 40,
  flex: "0 0 auto",
  display: "grid",
  placeItems: "center",
  background: "var(--coral-100)",
  border: "var(--border-hair)",
  borderRadius: "var(--radius-sm)",
  cursor: "pointer",
  color: "var(--coral-700)",
};

export function MilestoneListEditor({
  milestones,
  onChange,
}: {
  milestones: any[];
  onChange: (m: any[]) => void;
}) {
  const update = (i: number, patch: any) => onChange(milestones.map((m, idx) => (idx === i ? { ...m, ...patch } : m)));
  const remove = (i: number) => onChange(milestones.filter((_, idx) => idx !== i));
  const add = () => onChange([...milestones, emptyMilestone()]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {milestones.map((m, i) => (
        <div
          key={m._id || i}
          style={{
            display: "flex",
            gap: 10,
            alignItems: "flex-end",
            padding: 14,
            background: "var(--surface-sunk)",
            borderRadius: "var(--radius-md)",
            border: "var(--border-hair)",
            flexWrap: "wrap",
          }}
        >
          <Input
            label="Count"
            mono
            value={String(m.count ?? "")}
            onChange={(v) => update(i, { count: Number(v.replace(/\D/g, "")) || 0 })}
            style={{ width: 90 }}
          />
          <Select
            label="Reward"
            value={m.rewardType}
            onChange={(v) => update(i, { rewardType: v })}
            options={REWARD_TYPE_OPTIONS}
            style={{ width: 190 }}
          />
          <Input
            label="Value"
            value={m.rewardValue || ""}
            onChange={(v) => update(i, { rewardValue: v })}
            placeholder={rewardPlaceholder(m.rewardType)}
            style={{ width: 140 }}
          />
          <Input
            label="Label shown to customer"
            value={m.label || ""}
            onChange={(v) => update(i, { label: v })}
            placeholder={`e.g. ${m.count || 5} visits`}
            style={{ flex: 1, minWidth: 160 }}
          />
          <button type="button" onClick={() => remove(i)} style={trashBtnStyle} aria-label="Remove milestone">
            <Icon name="trash-2" size={16} />
          </button>
        </div>
      ))}
      {milestones.length === 0 && (
        <div style={{ padding: 20, textAlign: "center", color: "var(--text-muted)", font: "var(--type-body-sm)" }}>
          No milestones yet — add one below.
        </div>
      )}
      <Button variant="secondary" size="sm" icon={<Icon name="plus" size={16} />} onClick={add}>
        Add milestone
      </Button>
    </div>
  );
}

export function TiersEditor({ tiers, onChange }: { tiers: any[]; onChange: (t: any[]) => void }) {
  const update = (i: number, patch: any) => onChange(tiers.map((t, idx) => (idx === i ? { ...t, ...patch } : t)));
  const remove = (i: number) => onChange(tiers.filter((_, idx) => idx !== i));
  const add = () => onChange([...tiers, { name: `Tier ${tiers.length + 1}`, milestones: [emptyMilestone()] }]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {tiers.map((t, i) => (
        <Card key={t._id || i} tone="sunk" pad={16} elevation={0}>
          <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 14 }}>
            <Icon name="crown" size={18} color="var(--sun-700)" />
            <Input value={t.name || ""} onChange={(v) => update(i, { name: v })} placeholder="Tier name (e.g. Gold)" style={{ flex: 1 }} />
            <button type="button" onClick={() => remove(i)} style={trashBtnStyle} aria-label="Remove tier">
              <Icon name="trash-2" size={16} />
            </button>
          </div>
          <MilestoneListEditor milestones={t.milestones || []} onChange={(m) => update(i, { milestones: m })} />
        </Card>
      ))}
      <Button variant="secondary" size="sm" icon={<Icon name="plus" size={16} />} onClick={add}>
        Add tier
      </Button>
    </div>
  );
}

function SavedNote({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 6, font: "600 13px/1 var(--font-body)", color: "var(--success-ink)" }}>
      <Icon name="check-circle" size={15} /> Saved
    </div>
  );
}

function useSavedFlag() {
  const [saved, setSaved] = React.useState(false);
  const flash = React.useCallback(() => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }, []);
  return [saved, flash] as const;
}

/* ---------------------------- Earning & check-in ---------------------------- */

export function EarningSection({
  business,
  onSave,
  saving,
}: {
  business: any;
  onSave: (patch: any) => Promise<void>;
  saving?: boolean;
}) {
  const [earningMode, setEarningMode] = React.useState(business.earningMode || "visits");
  const [amountPerPoint, setAmountPerPoint] = React.useState(String(business.amountPerPoint ?? 100));
  const [minBillAmount, setMinBillAmount] = React.useState(String(business.minBillAmount ?? 0));
  const [checkInMode, setCheckInMode] = React.useState(business.checkInMode || "automatic");
  const [billAmountFieldEnabled, setBillAmountFieldEnabled] = React.useState(!!business.billAmountFieldEnabled);
  const [stampLimitPerDay, setStampLimitPerDay] = React.useState(String(business.stampLimitPerDay ?? 1));
  const [lapsedAfterDays, setLapsedAfterDays] = React.useState(String(business.lapsedAfterDays ?? 30));
  const [saved, flash] = useSavedFlag();

  const save = async () => {
    await onSave({
      earningMode,
      amountPerPoint: Number(amountPerPoint) || 1,
      minBillAmount: Number(minBillAmount) || 0,
      checkInMode,
      billAmountFieldEnabled,
      stampLimitPerDay: Math.max(1, Number(stampLimitPerDay) || 1),
      lapsedAfterDays: Math.max(1, Number(lapsedAfterDays) || 30),
    });
    flash();
  };

  return (
    <Card pad={24}>
      <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 560 }}>
        <div style={{ font: "var(--type-subtitle)", color: "var(--text-strong)" }}>Earning mode</div>
        <Select label="How customers earn stamps" value={earningMode} onChange={setEarningMode} options={EARNING_MODE_OPTIONS} />

        {earningMode === "bill_amount" && (
          <Input
            label="₹ per point"
            mono
            value={amountPerPoint}
            onChange={setAmountPerPoint}
            hint="e.g. 200 means every ₹200 spent earns 1 point."
            style={{ maxWidth: 220 }}
          />
        )}
        {earningMode === "visits_with_min_bill" && (
          <Input
            label="Minimum bill amount (₹)"
            mono
            value={minBillAmount}
            onChange={setMinBillAmount}
            hint="A visit only counts if the bill is at least this much."
            style={{ maxWidth: 220 }}
          />
        )}

        <Switch
          checked={billAmountFieldEnabled}
          onChange={setBillAmountFieldEnabled}
          label="Bill amount field"
          hint="Ask for the bill amount when marking a visit."
        />

        <hr style={{ border: 0, borderTop: "var(--border-hair)", margin: "4px 0" }} />

        <div style={{ font: "var(--type-subtitle)", color: "var(--text-strong)" }}>Check-in</div>
        <Select label="Visit confirmation" value={checkInMode} onChange={setCheckInMode} options={CHECK_IN_MODE_OPTIONS} />
        <Input
          label="Stamp limit per day (per phone number)"
          mono
          value={stampLimitPerDay}
          onChange={setStampLimitPerDay}
          style={{ maxWidth: 220 }}
        />
        <Input
          label="Mark customer lapsed after (days)"
          mono
          value={lapsedAfterDays}
          onChange={setLapsedAfterDays}
          style={{ maxWidth: 220 }}
        />

        <div style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 8 }}>
          <Button variant="primary" size="sm" onClick={save} disabled={saving}>
            {saving ? "Saving..." : "Save changes"}
          </Button>
          <SavedNote show={saved} />
        </div>
      </div>
    </Card>
  );
}

/* ---------------------------- Milestones & tiers ---------------------------- */

export function MilestonesSection({
  business,
  onSave,
  saving,
}: {
  business: any;
  onSave: (patch: any) => Promise<void>;
  saving?: boolean;
}) {
  const [afterFinalMilestone, setAfterFinalMilestone] = React.useState(business.afterFinalMilestone || "reset");
  const [milestones, setMilestones] = React.useState(business.milestones || []);
  const [tiers, setTiers] = React.useState(business.tiers || []);
  const [saved, flash] = useSavedFlag();

  const save = async () => {
    await onSave({ afterFinalMilestone, milestones, tiers });
    flash();
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <Card tone="sunk" pad={20} elevation={0}>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <Icon name="info" size={18} color="var(--sky-500)" />
          <div style={{ font: "var(--type-body)", color: "var(--text-body)" }}>
            A milestone is a point on the loyalty ladder that unlocks a reward — e.g. &ldquo;5 visits = free coffee&rdquo;.
            When a customer hits every milestone, decide what happens next below.
          </div>
        </div>
      </Card>

      <Card pad={24}>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <Select
            label="After the final milestone"
            value={afterFinalMilestone}
            onChange={setAfterFinalMilestone}
            options={AFTER_FINAL_OPTIONS}
            style={{ maxWidth: 360 }}
          />

          {afterFinalMilestone === "reset" ? (
            <>
              <div style={{ font: "var(--type-subtitle)", color: "var(--text-strong)" }}>Milestone ladder</div>
              <MilestoneListEditor milestones={milestones} onChange={setMilestones} />
            </>
          ) : (
            <>
              <div style={{ font: "var(--type-subtitle)", color: "var(--text-strong)" }}>Tiers</div>
              <div style={{ font: "var(--type-body-sm)", color: "var(--text-muted)" }}>
                Each tier has its own milestone ladder. Customers advance to the next tier after finishing the current one.
              </div>
              <TiersEditor tiers={tiers} onChange={setTiers} />
            </>
          )}

          <div style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 8 }}>
            <Button variant="primary" size="sm" onClick={save} disabled={saving}>
              {saving ? "Saving..." : "Save milestones"}
            </Button>
            <SavedNote show={saved} />
          </div>
        </div>
      </Card>
    </div>
  );
}

/* ---------------------------- Signup & rewards ---------------------------- */

export function SignupRewardsSection({
  business,
  onSave,
  saving,
}: {
  business: any;
  onSave: (patch: any) => Promise<void>;
  saving?: boolean;
}) {
  const [signupFields, setSignupFields] = React.useState(
    business.signupFields || { name: false, email: false, birthday: false }
  );
  const [headStartEnabled, setHeadStartEnabled] = React.useState(!!business.headStart?.enabled);
  const [headStartStamps, setHeadStartStamps] = React.useState(String(business.headStart?.stamps ?? 0));
  const [birthdayEnabled, setBirthdayEnabled] = React.useState(!!business.birthdayReward?.enabled);
  const [birthdayRewardType, setBirthdayRewardType] = React.useState(business.birthdayReward?.rewardType || "custom");
  const [birthdayRewardValue, setBirthdayRewardValue] = React.useState(business.birthdayReward?.rewardValue || "");
  const [birthdayLabel, setBirthdayLabel] = React.useState(business.birthdayReward?.label || "");
  const [saved, flash] = useSavedFlag();

  const save = async () => {
    await onSave({
      signupFields,
      headStart: { enabled: headStartEnabled, stamps: Math.max(0, Number(headStartStamps) || 0) },
      birthdayReward: {
        enabled: birthdayEnabled,
        rewardType: birthdayRewardType,
        rewardValue: birthdayRewardValue,
        label: birthdayLabel,
      },
    });
    flash();
  };

  return (
    <Card pad={24}>
      <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 560 }}>
        <div style={{ font: "var(--type-subtitle)", color: "var(--text-strong)" }}>Signup fields</div>
        <div style={{ font: "var(--type-body-sm)", color: "var(--text-muted)" }}>Phone number is always collected.</div>
        <Switch checked={!!signupFields.name} onChange={(v) => setSignupFields({ ...signupFields, name: v })} label="Name" />
        <Switch checked={!!signupFields.email} onChange={(v) => setSignupFields({ ...signupFields, email: v })} label="Email" />
        <Switch checked={!!signupFields.birthday} onChange={(v) => setSignupFields({ ...signupFields, birthday: v })} label="Birthday" />

        <hr style={{ border: 0, borderTop: "var(--border-hair)", margin: "4px 0" }} />

        <div style={{ font: "var(--type-subtitle)", color: "var(--text-strong)" }}>Head start</div>
        <Switch
          checked={headStartEnabled}
          onChange={setHeadStartEnabled}
          label="Give new members a head start"
          hint="Award stamps immediately on signup."
        />
        {headStartEnabled && (
          <Input label="Head-start stamps" mono value={headStartStamps} onChange={setHeadStartStamps} style={{ maxWidth: 160 }} />
        )}

        <hr style={{ border: 0, borderTop: "var(--border-hair)", margin: "4px 0" }} />

        <div style={{ font: "var(--type-subtitle)", color: "var(--text-strong)" }}>Birthday reward</div>
        <Switch
          checked={birthdayEnabled}
          onChange={setBirthdayEnabled}
          disabled={!signupFields.birthday}
          label="Send a birthday reward"
          hint={!signupFields.birthday ? "Turn on the birthday signup field first." : undefined}
        />
        {birthdayEnabled && signupFields.birthday && (
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Select label="Reward type" value={birthdayRewardType} onChange={setBirthdayRewardType} options={REWARD_TYPE_OPTIONS} style={{ width: 190 }} />
            <Input label="Value" value={birthdayRewardValue} onChange={setBirthdayRewardValue} placeholder={rewardPlaceholder(birthdayRewardType)} style={{ width: 140 }} />
            <Input label="Label" value={birthdayLabel} onChange={setBirthdayLabel} placeholder="e.g. Birthday treat" style={{ flex: 1, minWidth: 160 }} />
          </div>
        )}

        <div style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 8 }}>
          <Button variant="primary" size="sm" onClick={save} disabled={saving}>
            {saving ? "Saving..." : "Save changes"}
          </Button>
          <SavedNote show={saved} />
        </div>
      </div>
    </Card>
  );
}

/* ---------------------------- Branding ---------------------------- */

export function BrandingSection({
  branding,
  onSave,
  saving,
}: {
  branding: { primaryColor?: string; secondaryColor?: string };
  onSave: (patch: { primaryColor: string; secondaryColor: string }) => Promise<void>;
  saving?: boolean;
}) {
  const [primaryColor, setPrimaryColor] = React.useState(branding?.primaryColor || "#111827");
  const [secondaryColor, setSecondaryColor] = React.useState(branding?.secondaryColor || "#F59E0B");
  const [saved, flash] = useSavedFlag();

  const save = async () => {
    await onSave({ primaryColor, secondaryColor });
    flash();
  };

  const colorRow = (label: string, value: string, onChange: (v: string) => void) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <label style={{ font: "var(--type-label)", letterSpacing: "var(--tracking-label)", textTransform: "uppercase", color: "var(--text-muted)" }}>
        {label}
      </label>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <input
          type="color"
          value={/^#([0-9a-f]{3}){1,2}$/i.test(value) ? value : "#111827"}
          onChange={(e) => onChange(e.target.value)}
          style={{ width: 56, height: 56, border: "var(--border)", borderRadius: "var(--radius-sm)", padding: 2, background: "var(--paper-000)", cursor: "pointer" }}
        />
        <Input value={value} onChange={onChange} mono style={{ width: 160 }} />
      </div>
    </div>
  );

  return (
    <Card pad={24}>
      <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 480 }}>
        <div style={{ font: "var(--type-subtitle)", color: "var(--text-strong)" }}>Branding</div>
        <div style={{ font: "var(--type-body-sm)", color: "var(--text-muted)" }}>Colors shown on your customer-facing loyalty page.</div>
        <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
          {colorRow("Primary color", primaryColor, setPrimaryColor)}
          {colorRow("Secondary color", secondaryColor, setSecondaryColor)}
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <Button variant="primary" size="sm" onClick={save} disabled={saving}>
            {saving ? "Saving..." : "Save branding"}
          </Button>
          <SavedNote show={saved} />
        </div>
      </div>
    </Card>
  );
}

/* ---------------------------- PIN ---------------------------- */

export function PinSection({
  pin,
  hasPin,
  requireCurrentPin,
  onSave,
  saving,
  error,
}: {
  pin?: string | null;
  hasPin: boolean;
  requireCurrentPin: boolean;
  onSave: (newPin: string, currentPin?: string) => Promise<void>;
  saving?: boolean;
  error?: string;
}) {
  const [reveal, setReveal] = React.useState(false);
  const [currentPin, setCurrentPin] = React.useState("");
  const [newPin, setNewPin] = React.useState("");
  const [localError, setLocalError] = React.useState("");
  const [saved, flash] = useSavedFlag();

  const submit = async () => {
    setLocalError("");
    if (!/^\d{4,6}$/.test(newPin)) {
      setLocalError("PIN must be 4–6 digits");
      return;
    }
    await onSave(newPin, currentPin || undefined);
    setNewPin("");
    setCurrentPin("");
    flash();
  };

  return (
    <Card pad={24}>
      <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 480 }}>
        <div style={{ font: "var(--type-subtitle)", color: "var(--text-strong)" }}>Business PIN</div>
        <div style={{ font: "var(--type-body-sm)", color: "var(--text-muted)" }}>
          Used by staff to confirm visits (if PIN check-in is on) and to redeem rewards. Shown here so it&apos;s always at hand.
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 20px",
            background: "var(--surface-sunk)",
            borderRadius: "var(--radius-md)",
            border: "var(--border-hair)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Icon name="key" size={20} color="var(--ink-500)" />
            <span style={{ font: "700 28px/1 var(--font-mono)", letterSpacing: "0.1em", color: "var(--text-strong)" }}>
              {hasPin ? (reveal ? pin || "----" : "••••") : "Not set"}
            </span>
          </div>
          {hasPin && (
            <button
              type="button"
              onClick={() => setReveal((v) => !v)}
              aria-label={reveal ? "Hide PIN" : "Show PIN"}
              style={{ background: "transparent", border: 0, cursor: "pointer", color: "var(--ink-500)", padding: 8 }}
            >
              <Icon name={reveal ? "eye-off" : "eye"} size={20} />
            </button>
          )}
        </div>

        <hr style={{ border: 0, borderTop: "var(--border-hair)", margin: "4px 0" }} />

        <div style={{ font: "600 15px/1.3 var(--font-body)", color: "var(--text-strong)" }}>Change PIN</div>
        {requireCurrentPin && hasPin && (
          <Input label="Current PIN" type="password" mono placeholder="Enter current PIN" value={currentPin} onChange={setCurrentPin} />
        )}
        <Input
          label="New PIN"
          type="password"
          mono
          placeholder="4-6 digit PIN"
          value={newPin}
          onChange={(v) => { setNewPin(v); if (localError) setLocalError(""); }}
          error={localError}
        />
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <Button variant="primary" size="sm" onClick={submit} disabled={saving || !newPin}>
            {saving ? "Updating..." : "Update PIN"}
          </Button>
          <SavedNote show={saved} />
        </div>
        {error && <div role="alert" style={{ font: "600 14px/1.4 var(--font-body)", color: "var(--danger-ink)" }}>{error}</div>}
      </div>
    </Card>
  );
}
