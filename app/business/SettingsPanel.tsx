"use client";
import React from "react";
import { Button } from "../components/core/Button";
import { Card } from "../components/core/Card";
import { Icon } from "../components/core/Icon";
import { Input } from "../components/forms/Input";
import { NumberInput } from "../components/forms/NumberInput";
import { Select } from "../components/forms/Select";
import { Switch } from "../components/forms/Switch";

const LIMITS = {
  amountPerPoint: { min: 1, max: 100000 },
  minBillAmount: { min: 0, max: 1000000 },
  stampLimitPerDay: { min: 0, max: 50 },
  lapsedAfterDays: { min: 1, max: 3650 },
  headStartStamps: { min: 0, max: 100 },
  milestoneCount: { min: 1, max: 100000 },
  percentOff: { min: 1, max: 100 },
  flatOff: { min: 1, max: 1000000 },
};

function rangeError(value: number | "", limits: { min: number; max: number }): string | undefined {
  if (value === "") return "Required";
  if (value < limits.min) return `Min ${limits.min}`;
  if (value > limits.max) return `Max ${limits.max}`;
  return undefined;
}

const DEFAULT_TIER_LADDER = [
  { name: "Bronze", count: 5 },
  { name: "Silver", count: 8 },
  { name: "Gold", count: 12 },
  { name: "Platinum", count: 16 },
  { name: "Diamond", count: 20 },
  { name: "Sapphire", count: 25 },
  { name: "Ruby", count: 30 },
  { name: "Emerald", count: 36 },
  { name: "Master", count: 42 },
  { name: "Legend", count: 50 },
];

function generateDefaultTiers() {
  return DEFAULT_TIER_LADDER.map((t) => ({
    name: t.name,
    milestones: [{ count: t.count, rewardType: "custom", rewardValue: `${t.name} perk`, label: `Reach ${t.name}` }],
  }));
}

const REWARD_TYPE_OPTIONS = [
  { value: "free_item", label: "Free item" },
  { value: "percent_off", label: "% off the bill" },
  { value: "flat_off", label: "Flat ₹ off" },
  { value: "custom", label: "Custom reward" },
];

const EARNING_MODE_OPTIONS = [
  { value: "visits", label: "Visits only — 1 visit = 1 stamp" },
  { value: "bill_amount", label: "Bill amount — points per ₹ spent" },
  { value: "visits_with_min_bill", label: "Visits with a minimum bill" },
];

const CHECK_IN_MODE_OPTIONS = [
  { value: "automatic", label: "Automatic — no confirmation needed" },
  { value: "pin", label: "Business PIN — staff confirms every visit" },
];

const AFTER_FINAL_OPTIONS = [
  { value: "reset", label: "Keep the ladder (nothing resets)" },
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

interface MilestoneRowErrors {
  count?: string;
  rewardValue?: string;
  label?: string;
}

function validateMilestoneRow(m: any): MilestoneRowErrors {
  const errors: MilestoneRowErrors = {};
  const count = Number(m.count);
  if (!m.count && m.count !== 0) errors.count = "Required";
  else if (!Number.isInteger(count) || count < LIMITS.milestoneCount.min) errors.count = `Min ${LIMITS.milestoneCount.min}`;
  else if (count > LIMITS.milestoneCount.max) errors.count = `Max ${LIMITS.milestoneCount.max}`;

  if (!m.label || !m.label.trim()) errors.label = "Required";

  if (m.rewardType === "percent_off") {
    const n = Number(m.rewardValue);
    if (m.rewardValue === "" || m.rewardValue == null || Number.isNaN(n)) errors.rewardValue = "Required";
    else if (n < LIMITS.percentOff.min || n > LIMITS.percentOff.max) errors.rewardValue = `${LIMITS.percentOff.min}–${LIMITS.percentOff.max}`;
  } else if (m.rewardType === "flat_off") {
    const n = Number(m.rewardValue);
    if (m.rewardValue === "" || m.rewardValue == null || Number.isNaN(n)) errors.rewardValue = "Required";
    else if (n < LIMITS.flatOff.min) errors.rewardValue = `Min ${LIMITS.flatOff.min}`;
    else if (n > LIMITS.flatOff.max) errors.rewardValue = `Max ${LIMITS.flatOff.max}`;
  } else if (!m.rewardValue || !String(m.rewardValue).trim()) {
    errors.rewardValue = "Required";
  }

  return errors;
}

function hasMilestoneErrors(milestones: any[]): boolean {
  return milestones.length === 0 || milestones.some((m) => Object.keys(validateMilestoneRow(m)).length > 0);
}

function hasTierErrors(tiers: any[]): boolean {
  return tiers.length === 0 || tiers.some((t) => !t.name?.trim() || hasMilestoneErrors(t.milestones || []));
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

function MilestoneListEditor({
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
      {milestones.map((m, i) => {
        const rowErrors = validateMilestoneRow(m);
        return (
          <div
            key={m._id || i}
            style={{
              display: "flex",
              gap: 10,
              alignItems: "flex-start",
              padding: 14,
              background: "var(--surface-sunk)",
              borderRadius: "var(--radius-md)",
              border: "var(--border-hair)",
              flexWrap: "wrap",
            }}
          >
            <NumberInput
              label="Count"
              value={m.count ?? ""}
              onChange={(v) => update(i, { count: v })}
              min={LIMITS.milestoneCount.min}
              max={LIMITS.milestoneCount.max}
              error={rowErrors.count}
              style={{ width: 100 }}
            />
            <Select
              label="Reward"
              value={m.rewardType}
              onChange={(v) => update(i, { rewardType: v, rewardValue: "" })}
              options={REWARD_TYPE_OPTIONS}
              style={{ width: 190 }}
            />
            {m.rewardType === "percent_off" ? (
              <NumberInput
                label="Value (%)"
                value={m.rewardValue === "" ? "" : Number(m.rewardValue)}
                onChange={(v) => update(i, { rewardValue: v === "" ? "" : String(v) })}
                min={LIMITS.percentOff.min}
                max={LIMITS.percentOff.max}
                error={rowErrors.rewardValue}
                style={{ width: 140 }}
              />
            ) : m.rewardType === "flat_off" ? (
              <NumberInput
                label="Value (₹)"
                value={m.rewardValue === "" ? "" : Number(m.rewardValue)}
                onChange={(v) => update(i, { rewardValue: v === "" ? "" : String(v) })}
                min={LIMITS.flatOff.min}
                max={LIMITS.flatOff.max}
                error={rowErrors.rewardValue}
                style={{ width: 140 }}
              />
            ) : (
              <Input
                label="Value"
                value={m.rewardValue || ""}
                onChange={(v) => update(i, { rewardValue: v })}
                placeholder={rewardPlaceholder(m.rewardType)}
                error={rowErrors.rewardValue}
                style={{ width: 160 }}
              />
            )}
            <Input
              label="Label shown to customer"
              value={m.label || ""}
              onChange={(v) => update(i, { label: v })}
              placeholder={`e.g. ${m.count || 5} visits`}
              error={rowErrors.label}
              style={{ flex: 1, minWidth: 160 }}
            />
            <button type="button" onClick={() => remove(i)} style={{ ...trashBtnStyle, marginTop: 30 }} aria-label="Remove milestone">
              <Icon name="trash-2" size={16} />
            </button>
          </div>
        );
      })}
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

function TiersEditor({ tiers, onChange }: { tiers: any[]; onChange: (t: any[]) => void }) {
  const update = (i: number, patch: any) => onChange(tiers.map((t, idx) => (idx === i ? { ...t, ...patch } : t)));
  const remove = (i: number) => onChange(tiers.filter((_, idx) => idx !== i));
  const add = () => onChange([...tiers, { name: `Tier ${tiers.length + 1}`, milestones: [emptyMilestone()] }]);

  if (tiers.length === 0) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 16, alignItems: "flex-start" }}>
        <div style={{ padding: 20, background: "var(--surface-sunk)", borderRadius: "var(--radius-md)", font: "var(--type-body-sm)", color: "var(--text-muted)" }}>
          No tiers yet — a customer can&apos;t be promoted without at least one. Start from a ready-made 10-level ladder
          (Bronze → Legend) and edit the names, milestone counts and rewards to fit, or add tiers one at a time.
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <Button variant="primary" size="sm" icon={<Icon name="crown" size={16} />} onClick={() => onChange(generateDefaultTiers())}>
            Set up 10 tiers
          </Button>
          <Button variant="secondary" size="sm" icon={<Icon name="plus" size={16} />} onClick={add}>
            Add one tier
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {tiers.map((t, i) => (
        <Card key={t._id || i} tone="sunk" pad={16} elevation={0}>
          <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 14 }}>
            <span style={{ font: "700 13px/1 var(--font-mono)", color: "var(--text-muted)", width: 24 }}>{i + 1}</span>
            <Icon name="crown" size={18} color="var(--sun-700)" />
            <Input
              value={t.name || ""}
              onChange={(v) => update(i, { name: v })}
              placeholder="Tier name (e.g. Gold)"
              error={!t.name?.trim() ? "Required" : undefined}
              style={{ flex: 1 }}
            />
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

export function useSavedFlag() {
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
  const [amountPerPoint, setAmountPerPoint] = React.useState<number | "">(business.amountPerPoint ?? 100);
  const [minBillAmount, setMinBillAmount] = React.useState<number | "">(business.minBillAmount ?? 0);
  const [checkInMode, setCheckInMode] = React.useState(business.checkInMode || "automatic");
  const [billAmountFieldEnabled, setBillAmountFieldEnabled] = React.useState(!!business.billAmountFieldEnabled);
  const [stampLimitPerDay, setStampLimitPerDay] = React.useState<number | "">(business.stampLimitPerDay ?? 1);
  const [lapsedAfterDays, setLapsedAfterDays] = React.useState<number | "">(business.lapsedAfterDays ?? 365);
  const [saved, flash] = useSavedFlag();

  const amountPerPointError = earningMode === "bill_amount" ? rangeError(amountPerPoint, LIMITS.amountPerPoint) : undefined;
  const minBillAmountError = earningMode === "visits_with_min_bill" ? rangeError(minBillAmount, LIMITS.minBillAmount) : undefined;
  const stampLimitError = rangeError(stampLimitPerDay, LIMITS.stampLimitPerDay);
  const lapsedError = rangeError(lapsedAfterDays, LIMITS.lapsedAfterDays);

  const invalid = !!(amountPerPointError || minBillAmountError || stampLimitError || lapsedError);

  const save = async () => {
    if (invalid) return;
    await onSave({
      earningMode,
      amountPerPoint: amountPerPoint === "" ? LIMITS.amountPerPoint.min : amountPerPoint,
      minBillAmount: minBillAmount === "" ? 0 : minBillAmount,
      checkInMode,
      billAmountFieldEnabled,
      stampLimitPerDay: stampLimitPerDay === "" ? 1 : stampLimitPerDay,
      lapsedAfterDays: lapsedAfterDays === "" ? 365 : lapsedAfterDays,
    });
    flash();
  };

  return (
    <Card pad={24}>
      <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 560 }}>
        <div style={{ font: "var(--type-subtitle)", color: "var(--text-strong)" }}>Earning mode</div>
        <Select label="How customers earn stamps" value={earningMode} onChange={setEarningMode} options={EARNING_MODE_OPTIONS} />

        {earningMode === "bill_amount" && (
          <NumberInput
            label="₹ per point"
            value={amountPerPoint}
            onChange={setAmountPerPoint}
            min={LIMITS.amountPerPoint.min}
            max={LIMITS.amountPerPoint.max}
            error={amountPerPointError}
            hint={!amountPerPointError ? "e.g. 200 means every ₹200 spent earns 1 point." : undefined}
            style={{ maxWidth: 220 }}
          />
        )}
        {earningMode === "visits_with_min_bill" && (
          <NumberInput
            label="Minimum bill amount (₹)"
            value={minBillAmount}
            onChange={setMinBillAmount}
            min={LIMITS.minBillAmount.min}
            max={LIMITS.minBillAmount.max}
            error={minBillAmountError}
            hint={!minBillAmountError ? "A visit only counts if the bill is at least this much." : undefined}
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
        <NumberInput
          label="Stamp limit per day (per phone number)"
          value={stampLimitPerDay}
          onChange={setStampLimitPerDay}
          min={LIMITS.stampLimitPerDay.min}
          max={LIMITS.stampLimitPerDay.max}
          error={stampLimitError}
          hint={!stampLimitError ? "0 = no daily limit." : undefined}
          style={{ maxWidth: 220 }}
        />
        <NumberInput
          label="Mark customer lapsed after (days)"
          value={lapsedAfterDays}
          onChange={setLapsedAfterDays}
          min={LIMITS.lapsedAfterDays.min}
          max={LIMITS.lapsedAfterDays.max}
          error={lapsedError}
          style={{ maxWidth: 220 }}
        />

        <div style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 8 }}>
          <Button variant="primary" size="sm" onClick={save} disabled={saving || invalid}>
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

  const invalid = afterFinalMilestone === "reset" ? hasMilestoneErrors(milestones) : hasTierErrors(tiers);

  const save = async () => {
    if (invalid) return;
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
            hint={
              afterFinalMilestone === "reset"
                ? "Customers keep every reward they've ever earned — finishing the ladder never erases their progress."
                : "Customers move up to the next tier's own ladder once they finish this one, all the way to your top tier."
            }
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
                Customers get their first tier as soon as they sign up, and get promoted to the next one every time they
                finish the current tier&apos;s milestone ladder — right up to your top tier.
              </div>
              <TiersEditor tiers={tiers} onChange={setTiers} />
            </>
          )}

          <div style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 8 }}>
            <Button variant="primary" size="sm" onClick={save} disabled={saving || invalid}>
              {saving ? "Saving..." : "Save milestones"}
            </Button>
            <SavedNote show={saved} />
            {invalid && (
              <span style={{ font: "600 13px/1.3 var(--font-body)", color: "var(--danger-ink)" }}>
                Fix the highlighted fields before saving.
              </span>
            )}
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
  // Tolerates a backend that hasn't migrated the old `birthday` field name to
  // `dob` yet — reads whichever one is present so the toggle doesn't appear to
  // silently reset after a save+refresh while that migration is in flight.
  const [signupFields, setSignupFields] = React.useState(() => {
    const sf = business.signupFields || {};
    return { name: !!sf.name, email: !!sf.email, dob: !!(sf.dob ?? sf.birthday) };
  });
  const [headStartEnabled, setHeadStartEnabled] = React.useState(!!business.headStart?.enabled);
  const [headStartStamps, setHeadStartStamps] = React.useState<number | "">(business.headStart?.stamps ?? 0);
  const [saved, flash] = useSavedFlag();

  const headStartError = headStartEnabled ? rangeError(headStartStamps, LIMITS.headStartStamps) : undefined;
  const invalid = !!headStartError;

  const save = async () => {
    if (invalid) return;
    await onSave({
      signupFields,
      headStart: { enabled: headStartEnabled, stamps: headStartStamps === "" ? 0 : headStartStamps },
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
        <Switch
          checked={!!signupFields.dob}
          onChange={(v) => setSignupFields({ ...signupFields, dob: v })}
          label="Date of birth"
          hint="We'll flag today's birthdays on your dashboard so you know who to treat."
        />

        <hr style={{ border: 0, borderTop: "var(--border-hair)", margin: "4px 0" }} />

        <div style={{ font: "var(--type-subtitle)", color: "var(--text-strong)" }}>Head start</div>
        <Switch
          checked={headStartEnabled}
          onChange={setHeadStartEnabled}
          label="Give new members a head start"
          hint="Award stamps immediately on signup."
        />
        {headStartEnabled && (
          <NumberInput
            label="Head-start stamps"
            value={headStartStamps}
            onChange={setHeadStartStamps}
            min={LIMITS.headStartStamps.min}
            max={LIMITS.headStartStamps.max}
            error={headStartError}
            style={{ maxWidth: 180 }}
          />
        )}

        <div style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 8 }}>
          <Button variant="primary" size="sm" onClick={save} disabled={saving || invalid}>
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

  const HEX_RE = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i;
  const primaryError = HEX_RE.test(primaryColor) ? undefined : "Must be a hex color, e.g. #111827";
  const secondaryError = HEX_RE.test(secondaryColor) ? undefined : "Must be a hex color, e.g. #F59E0B";
  const invalid = !!(primaryError || secondaryError);

  const save = async () => {
    if (invalid) return;
    await onSave({ primaryColor, secondaryColor });
    flash();
  };

  const colorRow = (label: string, value: string, onChange: (v: string) => void, error?: string) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <label style={{ font: "var(--type-label)", letterSpacing: "var(--tracking-label)", textTransform: "uppercase", color: "var(--text-muted)" }}>
        {label}
      </label>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <input
          type="color"
          value={HEX_RE.test(value) ? value : "#111827"}
          onChange={(e) => onChange(e.target.value)}
          style={{ width: 56, height: 56, border: "var(--border)", borderRadius: "var(--radius-sm)", padding: 2, background: "var(--paper-000)", cursor: "pointer" }}
        />
        <Input value={value} onChange={onChange} mono error={error} style={{ width: 160 }} />
      </div>
    </div>
  );

  return (
    <Card pad={24}>
      <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 480 }}>
        <div style={{ font: "var(--type-subtitle)", color: "var(--text-strong)" }}>Branding</div>
        <div style={{ font: "var(--type-body-sm)", color: "var(--text-muted)" }}>Colors shown on your customer-facing loyalty page.</div>
        <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
          {colorRow("Primary color", primaryColor, setPrimaryColor, primaryError)}
          {colorRow("Secondary color", secondaryColor, setSecondaryColor, secondaryError)}
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <Button variant="primary" size="sm" onClick={save} disabled={saving || invalid}>
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
  onSave,
  saving,
  error,
}: {
  pin?: string | null;
  onSave: (newPin: string) => Promise<void>;
  saving?: boolean;
  error?: string;
}) {
  const hasPin = !!pin;
  const [reveal, setReveal] = React.useState(false);
  const [newPin, setNewPin] = React.useState("");
  const [localError, setLocalError] = React.useState("");
  const [saved, flash] = useSavedFlag();

  const submit = async () => {
    setLocalError("");
    if (!/^\d{4,6}$/.test(newPin)) {
      setLocalError("PIN must be 4–6 digits");
      return;
    }
    await onSave(newPin);
    setNewPin("");
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
