const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Matches the backend's own rule exactly (business.routes.js: body("pin").matches(/^\d{4,6}$/)).
const PIN_RE = /^\d{4,6}$/;
// Indian mobile numbers: 10 digits, first digit 6-9 (TRAI numbering plan).
const INDIAN_MOBILE_RE = /^[6-9]\d{9}$/;

export function validateEmail(email: string, label = "Email"): string | undefined {
  const trimmed = email.trim();
  if (!trimmed) return `${label} is required`;
  if (!EMAIL_RE.test(trimmed)) return "Enter a valid email address";
  return undefined;
}

/** For optional email fields (e.g. customer signup) — only checks format, doesn't require a value. */
export function validateEmailIfProvided(email: string): string | undefined {
  if (!email.trim()) return undefined;
  return EMAIL_RE.test(email.trim()) ? undefined : "Enter a valid email address";
}

export function validateIndianPhone(phone: string): string | undefined {
  const digits = phone.replace(/\D/g, "");
  if (!digits) return "Phone number is required";
  if (digits.length !== 10) return "Enter a 10-digit phone number";
  if (!INDIAN_MOBILE_RE.test(digits)) return "Enter a valid Indian mobile number";
  return undefined;
}

/** Whole years between a "YYYY-MM-DD" date of birth and today. */
export function calcAge(dob?: string | null): number | null {
  if (!dob || !/^\d{4}-\d{2}-\d{2}$/.test(dob)) return null;
  const birth = new Date(`${dob}T00:00:00`);
  if (Number.isNaN(birth.getTime())) return null;
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const monthDiff = now.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birth.getDate())) age--;
  return age;
}

export function validateDob(dob: string, minAge = 8, maxAge = 90): string | undefined {
  if (!dob) return undefined;
  const age = calcAge(dob);
  if (age == null) return "Enter a valid date";
  if (age < minAge) return `Must be at least ${minAge} years old`;
  if (age > maxAge) return "Enter a valid date of birth";
  return undefined;
}

export interface LoginFieldErrors {
  email?: string;
  password?: string;
}

export function validateLoginForm(email: string, password: string): LoginFieldErrors {
  const errors: LoginFieldErrors = {};

  const emailError = validateEmail(email);
  if (emailError) errors.email = emailError;

  if (!password) errors.password = "Password is required";

  return errors;
}

export interface CreateBusinessFieldErrors {
  name?: string;
  ownerEmail?: string;
  ownerPassword?: string;
}

// Mirrors admin.routes.js: body("name").notEmpty(), body("ownerEmail").isEmail(), body("ownerPassword").isLength({ min: 8 }).
export function validateCreateBusinessForm(
  name: string,
  ownerEmail: string,
  ownerPassword: string
): CreateBusinessFieldErrors {
  const errors: CreateBusinessFieldErrors = {};
  if (!name.trim()) errors.name = "Business name is required";

  const emailError = validateEmail(ownerEmail, "Owner email");
  if (emailError) errors.ownerEmail = emailError;

  if (!ownerPassword) errors.ownerPassword = "Owner password is required";
  else if (ownerPassword.length < 8) errors.ownerPassword = "Password must be at least 8 characters";

  return errors;
}

/** Mirrors business.routes.js: body("pin").matches(/^\d{4,6}$/). */
export function validatePinFormat(pin: string): string | undefined {
  if (!PIN_RE.test(pin)) return "PIN must be 4–6 digits";
  return undefined;
}

/**
 * Splits an ApiError's field-level `details` into per-field messages (matched
 * against `knownFields`) and a leftover general message for anything else.
 */
export function splitFieldErrors<T extends string>(
  details: { field: string; message: string }[] | undefined,
  knownFields: readonly T[]
): { fields: Partial<Record<T, string>>; general: string[] } {
  const fields: Partial<Record<T, string>> = {};
  const general: string[] = [];
  for (const d of details || []) {
    if ((knownFields as readonly string[]).includes(d.field)) {
      fields[d.field as T] = d.message;
    } else {
      general.push(d.message);
    }
  }
  return { fields, general };
}
