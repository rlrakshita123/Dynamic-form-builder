/*
  WHAT THIS FILE DOES:
  1. Provides a global footer visible across all pages.
  2. Displays product branding and technology attribution.
  3. Gives the app a polished, production-ready feel.
  4. Acts as the visual closure for every page layout.
*/

export default function Footer() {
  return (
    <footer
      style={{
        marginTop: "80px",
        borderTop: "1px solid var(--border-color)",
        background: "var(--bg-primary)",
      }}
    >
      <div
        className="container"
        style={{
          padding: "24px 0",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          textAlign: "center",
        }}
      >
        <span
          style={{
            color: "var(--text-secondary)",
            fontSize: "14px",
          }}
        >
          © {new Date().getFullYear()} FormForge
        </span>

        <span
          style={{
            color: "var(--text-muted)",
            fontSize: "13px",
          }}
        >
          Built with React, Node.js, MongoDB & Airtable API
        </span>
      </div>
    </footer>
  );
}
