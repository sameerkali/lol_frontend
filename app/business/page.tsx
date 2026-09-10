import Link from "next/link";
import { getAllBusinesses } from "./data";

export default function BusinessIndex() {
  const businesses = getAllBusinesses();

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--surface-page)",
        padding: 24,
      }}
    >
      <div style={{ maxWidth: 560, width: "100%", display: "flex", flexDirection: "column", gap: 24 }}>
        <div style={{ textAlign: "center", marginBottom: 16 }}>
          <h1 style={{ font: "var(--type-title)", letterSpacing: "var(--tracking-display)", color: "var(--text-strong)", margin: 0 }}>
            Choose a business
          </h1>
          <p style={{ font: "var(--type-body)", color: "var(--text-muted)", marginTop: 8 }}>
            Select which business panel to open.
          </p>
        </div>

        {businesses.map((b) => (
          <Link key={b.id} href={`/business/${b.id}`}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                padding: "20px 24px",
                background: "var(--paper-000)",
                border: "var(--border)",
                borderRadius: "var(--radius-lg)",
                boxShadow: "var(--pop-2)",
                cursor: "pointer",
                transition: "all var(--dur-fast) var(--ease-out)",
              }}
            >
              <span
                style={{
                  width: 48,
                  height: 48,
                  display: "grid",
                  placeItems: "center",
                  background: "var(--grape-100)",
                  border: "var(--border-hair)",
                  borderRadius: "50%",
                  font: "800 20px/1 var(--font-display)",
                  color: "var(--grape-700)",
                  flex: "0 0 auto",
                }}
              >
                {b.name.charAt(0)}
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ font: "var(--type-subtitle)", letterSpacing: "var(--tracking-display)", color: "var(--text-strong)" }}>
                  {b.name}
                </div>
                <div style={{ font: "var(--type-body-sm)", color: "var(--text-muted)" }}>
                  {b.location} · {b.customers.length} customers
                </div>
              </div>
              <span
                style={{
                  font: "700 15px/1 var(--font-body)",
                  color: "var(--grape-500)",
                }}
              >
                Open
              </span>
            </div>
          </Link>
        ))}

        <Link href="/">
          <div style={{ textAlign: "center", font: "var(--type-body)", color: "var(--text-muted)", marginTop: 8, cursor: "pointer" }}>
            Back to home
          </div>
        </Link>
      </div>
    </div>
  );
}
