import Link from "next/link";

export default function Home() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--surface-page)",
        padding: 24,
        gap: 40,
      }}
    >
      <div style={{ textAlign: "center" }}>
        <h1
          style={{
            font: "var(--type-hero)",
            letterSpacing: "var(--tracking-display)",
            color: "var(--text-strong)",
            margin: 0,
          }}
        >
          lol<span style={{ color: "var(--coral-500)" }}>.</span>
        </h1>
        <p
          style={{
            font: "var(--type-body-lg)",
            color: "var(--text-muted)",
            marginTop: 12,
            maxWidth: 480,
          }}
        >
          A digital stamp card for restaurants and cafes. Tap, stamp, reward.
        </p>
      </div>

      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center" }}>
        <Link href="/customer">
          <button
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 12,
              padding: "32px 40px",
              background: "var(--grape-500)",
              color: "var(--paper-000)",
              border: "var(--border)",
              borderRadius: "var(--radius-xl)",
              boxShadow: "var(--pop-3)",
              cursor: "pointer",
              font: "var(--type-subtitle)",
              letterSpacing: "var(--tracking-display)",
              minWidth: 200,
              transition: "all var(--dur-fast) var(--ease-out)",
            }}
          >
            <span style={{ font: "var(--type-display)", fontSize: 48 }}>📱</span>
            Customer page
            <span style={{ font: "var(--type-body-sm)", opacity: 0.85 }}>Mobile web, no app</span>
          </button>
        </Link>

        <Link href="/business">
          <button
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 12,
              padding: "32px 40px",
              background: "var(--paper-000)",
              color: "var(--text-strong)",
              border: "var(--border)",
              borderRadius: "var(--radius-xl)",
              boxShadow: "var(--pop-3)",
              cursor: "pointer",
              font: "var(--type-subtitle)",
              letterSpacing: "var(--tracking-display)",
              minWidth: 200,
              transition: "all var(--dur-fast) var(--ease-out)",
            }}
          >
            <span style={{ font: "var(--type-display)", fontSize: 48 }}>📊</span>
            Business panel
            <span style={{ font: "var(--type-body-sm)", color: "var(--text-muted)" }}>Dashboard & settings</span>
          </button>
        </Link>

        <Link href="/admin">
          <button
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 12,
              padding: "32px 40px",
              background: "var(--ink-900)",
              color: "var(--paper-000)",
              border: "var(--border)",
              borderRadius: "var(--radius-xl)",
              boxShadow: "var(--pop-3)",
              cursor: "pointer",
              font: "var(--type-subtitle)",
              letterSpacing: "var(--tracking-display)",
              minWidth: 200,
              transition: "all var(--dur-fast) var(--ease-out)",
            }}
          >
            <span style={{ font: "var(--type-display)", fontSize: 48 }}>⚙️</span>
            Admin panel
            <span style={{ font: "var(--type-body-sm)", opacity: 0.7 }}>Manage businesses</span>
          </button>
        </Link>
      </div>
    </div>
  );
}
