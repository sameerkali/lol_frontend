"use client";
import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Icon } from "../core/Icon";
import { validateDob } from "../../lib/validation";

const DateField = React.forwardRef<HTMLButtonElement, { value?: string; onClick?: () => void; placeholder?: string; error?: string }>(
  ({ value, onClick, placeholder, error }, ref) => (
    <button
      type="button"
      ref={ref}
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        width: "100%",
        background: "var(--paper-000)",
        border: `3px solid ${error ? "var(--coral-500)" : "var(--line)"}`,
        borderRadius: "var(--radius-md)",
        boxShadow: "var(--pop-1)",
        padding: "0 16px",
        minHeight: 56,
        cursor: "pointer",
        textAlign: "left",
      }}
    >
      <Icon name="cake" size={20} color="var(--ink-500)" />
      <span style={{ flex: 1, font: "500 16px/1 var(--font-body)", color: value ? "var(--text-strong)" : "var(--text-muted)" }}>
        {value || placeholder}
      </span>
    </button>
  )
);
DateField.displayName = "DateField";

/** Date-of-birth picker with quick month/year navigation — far friendlier than a native date input for selecting a birthdate decades back. */
export function DateOfBirthInput({
  value,
  onChange,
  label = "Date of birth",
  hint,
  minAge = 8,
  maxAge = 90,
}: {
  value: string;
  onChange: (v: string) => void;
  label?: string;
  hint?: string;
  minAge?: number;
  maxAge?: number;
}) {
  const rid = React.useId();
  const error = value ? validateDob(value, minAge, maxAge) : undefined;

  const today = new Date();
  const maxDate = new Date(today.getFullYear() - minAge, today.getMonth(), today.getDate());
  const minDate = new Date(today.getFullYear() - maxAge, today.getMonth(), today.getDate());
  const selected = /^\d{4}-\d{2}-\d{2}$/.test(value) ? new Date(`${value}T00:00:00`) : null;

  const toIso = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };

  return (
    <div className="lol-dob-picker" style={{ display: "flex", flexDirection: "column", gap: 8, minWidth: 0 }}>
      {label ? (
        <label
          htmlFor={rid}
          style={{ font: "var(--type-label)", letterSpacing: "var(--tracking-label)", textTransform: "uppercase", color: "var(--text-muted)" }}
        >
          {label}
        </label>
      ) : null}
      <DatePicker
        id={rid}
        selected={selected}
        onChange={(d: Date | null) => onChange(d ? toIso(d) : "")}
        minDate={minDate}
        maxDate={maxDate}
        openToDate={selected || maxDate}
        showMonthDropdown
        showYearDropdown
        dropdownMode="select"
        dateFormat="dd MMM yyyy"
        placeholderText="Select date"
        customInput={<DateField error={error} />}
      />
      {error ? (
        <span role="alert" style={{ font: "var(--type-body-sm)", color: "var(--danger-ink)", fontWeight: 600 }}>
          {error}
        </span>
      ) : hint ? (
        <span style={{ font: "var(--type-body-sm)", color: "var(--text-muted)" }}>{hint}</span>
      ) : null}
    </div>
  );
}
