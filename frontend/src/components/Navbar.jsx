import { Link, useLocation, useNavigate } from "react-router-dom";

/*
  WHAT THIS FILE DOES:
  1. Renders a global, sticky navigation bar for all pages.
  2. Shows public navigation (Explore Forms) for everyone.
  3. Switches Login / Logout based on auth state.
  4. Routes users correctly depending on login status.
*/

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  // 🔐 TEMP auth check (cookie-based)
  const isLoggedIn = document.cookie.includes("app_user_id");

  const handleLogout = async () => {
    try {
      // Proper backend logout
      await fetch(
        "https://dynamic-form-builder-0dnd.onrender.com/auth/logout",
        { credentials: "include" }
      );
    } catch (e) {
      console.error("Logout error", e);
    } finally {
      navigate("/");
      window.location.reload();
    }
  };

  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        width: "100%",
        background: "var(--bg-primary)",
        borderBottom: "1px solid var(--border-color)",
        backdropFilter: "blur(8px)",
      }}
    >
      <div
        className="container"
        style={{
          height: "72px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* LEFT: LOGO */}
        <Link
          to={isLoggedIn ? "/forms" : "/"}
          style={{
            fontSize: "22px",
            fontWeight: "800",
            color: "var(--text-primary)",
            textDecoration: "none",
            letterSpacing: "0.4px",
          }}
        >
          FormForge
        </Link>

        {/* CENTER: LINKS */}
        <div style={{ display: "flex", gap: "20px" }}>
          <Link
            to="/explore"
            style={{
              textDecoration: "none",
              color: "var(--text-secondary)",
              fontWeight:
                location.pathname.startsWith("/explore") ? "600" : "400",
            }}
          >
            Explore Forms
          </Link>

          {isLoggedIn && (
            <Link
              to="/forms"
              style={{
                textDecoration: "none",
                color: "var(--text-secondary)",
                fontWeight:
                  location.pathname.startsWith("/forms") ? "600" : "400",
              }}
            >
              Dashboard
            </Link>
          )}
        </div>

        {/* RIGHT: AUTH ACTION */}
        {!isLoggedIn ? (
          <a
            href="https://dynamic-form-builder-0dnd.onrender.com/auth/google"
            className="btn btn-primary"
          >
            Continue with Google
          </a>
        ) : (
          <button
            className="btn btn-secondary"
            onClick={handleLogout}
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}
