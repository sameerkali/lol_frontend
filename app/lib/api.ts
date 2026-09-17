const PROD_API_URL = "https://lol-api.expendifii.com/api";
const DEV_API_URL = "http://localhost:5001/api";

// NEXT_PUBLIC_API_URL wins if set; otherwise the deployed backend is the
// default, with localhost only used as a backup while running `next dev`.
const BASE =
  process.env.NEXT_PUBLIC_API_URL ||
  (process.env.NODE_ENV === "development" ? DEV_API_URL : PROD_API_URL);

class ApiError extends Error {
  status: number;
  details?: { field: string; message: string }[];
  constructor(message: string, status: number, details?: { field: string; message: string }[]) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

function getAuthHeaders(): Record<string, string> {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request<T>(path: string, opts: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = getAuthHeaders();

  let body = opts.body;
  if (body && !(body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify(body);
  }

  const res = await fetch(`${BASE}${path}`, {
    method: opts.method || "GET",
    headers,
    body,
  });

  const json = await res.json();

  if (!res.ok || json.success === false) {
    const msg = json.message || json.error || `Request failed (${res.status})`;
    const details = json.details || [];
    throw new ApiError(msg, res.status, details);
  }
  return json.data ?? json;
}

async function downloadFile(path: string, filenameFallback: string): Promise<void> {
  const res = await fetch(`${BASE}${path}`, { headers: getAuthHeaders() });
  if (!res.ok) {
    let msg = `Request failed (${res.status})`;
    try {
      const json = await res.json();
      msg = json.message || msg;
    } catch {
      // response wasn't JSON (e.g. an actual file stream failure) — keep the generic message
    }
    throw new ApiError(msg, res.status);
  }

  const disposition = res.headers.get("Content-Disposition") || "";
  const match = disposition.match(/filename="?([^"]+)"?/);
  const filename = match ? match[1] : filenameFallback;

  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: "POST", body: body as any }),
  put: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: "PUT", body: body as any }),
  patch: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: "PATCH", body: body as any }),
  del: <T>(path: string) => request<T>(path, { method: "DELETE" }),
  upload: <T>(path: string, formData: FormData) =>
    request<T>(path, { method: "POST", body: formData }),
  download: downloadFile,
};
