const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Matches the backend's own rule exactly (business.routes.js: body("pin").matches(/^\d{4,6}$/)).
const PIN_RE = /^\d{4,6}$/;

function validateEmail(email: string, label = "Email"): string | undefined {
  const trimmed = email.trim();
  if (!trimmed) return `${label} is required`;
  if (!EMAIL_RE.test(trimmed)) return "Enter a valid email address";
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
