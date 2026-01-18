import { Link, useLocation } from "react-router-dom";

/*
  WHAT THIS FILE DOES:
  1. Provides a global navigation bar visible across all pages.
  2. Gives unauthenticated users access to public forms via Explore.
  3. Keeps authentication entry (Login / Get Started) always accessible.
  4. Acts as the top-level navigation foundation for the entire app.
*/

export default function Navbar() {
  const location = useLocation();

  return (
    <nav
      style={{
        width: "100%",
        borderBottom: "1px solid var(--border-color)",
        background: "var(--bg-primary)",
      }}
    >
      <div
        className="container"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "64px",
        }}
      >
        {/* LEFT: LOGO / BRAND */}
        <Link
          to="/"
          style={{
            fontSize: "20px",
            fontWeight: "700",
            color: "var(--text-primary)",
            textDecoration: "none",
          }}
        >
          FormForge
        </Link>

        {/* RIGHT: NAV ACTIONS */}
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <Link
            to="/explore"
            className="btn btn-ghost"
            style={{
              fontWeight:
                location.pathname.startsWith("/explore") ? "600" : "400",
            }}
          >
            Explore Forms
          </Link>

          <a
            href="https://dynamic-form-builder-0dnd.onrender.com/auth/google"
            className="btn btn-primary"
          >
            Login
          </a>
        </div>
      </div>
    </nav>
  );
}
