const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";

class ApiError extends Error {
  status: number;
  details?: { field: string; message: string }[];
  constructor(message: string, status: number, details?: { field: string; message: string }[]) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

async function request<T>(path: string, opts: RequestInit = {}): Promise<T> {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const headers: Record<string, string> = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;

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
};

export { ApiError };
