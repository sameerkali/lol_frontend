const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface LoginFieldErrors {
  email?: string;
  password?: string;
}

export function validateLoginForm(email: string, password: string): LoginFieldErrors {
  const errors: LoginFieldErrors = {};
  const trimmedEmail = email.trim();

  if (!trimmedEmail) errors.email = "Email is required";
  else if (!EMAIL_RE.test(trimmedEmail)) errors.email = "Enter a valid email address";

  if (!password) errors.password = "Password is required";

  return errors;
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
