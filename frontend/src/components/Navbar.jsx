import { Link, useLocation, useNavigate } from "react-router-dom";

/*
  WHAT THIS FILE DOES:
  1. Renders a global, sticky navigation bar for all pages.
  2. Allows public users to explore public forms without login.
  3. Shows Google login or Logout based on authentication state.
  4. Acts as the primary navigation anchor for the entire product.
*/

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  // 🔐 Simple auth check (cookie-based session)
  const isLoggedIn = document.cookie.includes("app_user_id");

  const handleLogout = () => {
    // clear cookie (backend session will also expire naturally)
    document.cookie =
      "app_user_id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    navigate("/");
    window.location.reload();
  };

  return (
    <nav
      style={{
        width: "100%",
        position: "sticky",
        top: 0,
        zIndex: 100,
        background: "var(--bg-primary)",
        borderBottom: "1px solid var(--border-color)",
        backdropFilter: "blur(6px)",
      }}
    >
      <div
        className="container"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "72px",
        }}
      >
        {/* LEFT: BRAND */}
        <Link
          to="/"
          style={{
            fontSize: "22px",
            fontWeight: "800",
            letterSpacing: "0.5px",
            color: "var(--text-primary)",
            textDecoration: "none",
          }}
        >
          FormForge
        </Link>

        {/* CENTER: NAV LINKS */}
        <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
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
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
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
      </div>
    </nav>
  );
}
