import CustomerPage from "./CustomerPage";

export default async function Page({ searchParams }: { searchParams: Promise<{ slug?: string }> }) {
  const { slug } = await searchParams;
  if (!slug) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--surface-page)", padding: 24 }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ font: "var(--type-title)", letterSpacing: "var(--tracking-display)", color: "var(--text-strong)" }}>No business specified</div>
          <div style={{ font: "var(--type-body)", color: "var(--text-muted)", marginTop: 8 }}>Add <code>?slug=your-business</code> to the URL.</div>
        </div>
      </div>
    );
  }
  return <CustomerPage slug={slug} />;
}
