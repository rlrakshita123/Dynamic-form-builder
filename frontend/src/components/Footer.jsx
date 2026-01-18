import { Link } from "react-router-dom";

/*
  WHAT THIS FILE DOES:
  1. Provides a rich, multi-section footer across all pages.
  2. Adds navigation, product context, and trust-building content.
  3. Makes the application feel complete and production-ready.
  4. Acts as a strong visual and informational closure for the UI.
*/

export default function Footer() {
  return (
    <footer
      style={{
        marginTop: "120px",
        background: "var(--bg-primary)",
        borderTop: "1px solid var(--border-color)",
      }}
    >
      <div
        className="container"
        style={{
          padding: "56px 0 32px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "32px",
        }}
      >
        {/* BRAND / ABOUT */}
        <div>
          <h3 style={{ marginBottom: "12px" }}>FormForge</h3>
          <p
            style={{
              fontSize: "14px",
              color: "var(--text-secondary)",
              lineHeight: "1.6",
            }}
          >
            Build powerful, dynamic forms and sync responses directly to
            Airtable. Designed for speed, flexibility, and real-world workflows.
          </p>
        </div>

        {/* PRODUCT */}
        <div>
          <h4 style={{ marginBottom: "12px" }}>Product</h4>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            <li>
              <Link to="/explore" className="footer-link">
                Explore Public Forms
              </Link>
            </li>
            <li>
              <Link to="/" className="footer-link">
                Create Forms
              </Link>
            </li>
            <li>
              <span className="footer-link muted">
                Airtable Sync
              </span>
            </li>
          </ul>
        </div>

        {/* RESOURCES */}
        <div>
          <h4 style={{ marginBottom: "12px" }}>Resources</h4>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            <li>
              <span className="footer-link muted">Documentation</span>
            </li>
            <li>
              <span className="footer-link muted">API Reference</span>
            </li>
            <li>
              <span className="footer-link muted">Support</span>
            </li>
          </ul>
        </div>

        {/* TECH STACK */}
        <div>
          <h4 style={{ marginBottom: "12px" }}>Tech Stack</h4>
          <p
            style={{
              fontSize: "14px",
              color: "var(--text-secondary)",
              lineHeight: "1.6",
            }}
          >
            React • Node.js • MongoDB • Airtable API • OAuth
          </p>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div
        style={{
          borderTop: "1px solid var(--border-color)",
          padding: "16px 0",
          textAlign: "center",
          fontSize: "13px",
          color: "var(--text-muted)",
        }}
      >
        © {new Date().getFullYear()} FormForge · Built for real-world use
      </div>
    </footer>
  );
}
