import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "../utils/axios";

/*
  WHAT THIS FILE DOES:
  1. Renders a global navigation bar across the app.
  2. Determines login state using /auth/me (single source of truth).
  3. Shows "Continue with Google" or "Logout" correctly.
  4. Handles logout cleanly by clearing auth state and redirecting.
*/

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(null); // null = loading

  // 🔐 Check auth status ONCE on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await axios.get("/auth/me");
      setIsLoggedIn(res.data.authenticated);
    } catch {
      setIsLoggedIn(false);
    }
  };

  // 🚪 Logout handler
  const handleLogout = async () => {
    try {
      await axios.post("/auth/logout");

      // IMPORTANT: update state AFTER backend clears cookie
      setIsLoggedIn(false);

      // redirect to landing
      navigate("/");
    } catch (err) {
      console.error("Logout failed", err);
    }
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
        {/* BRAND */}
        <Link
          to={isLoggedIn ? "/forms" : "/"}
          style={{
            fontSize: "22px",
            fontWeight: "800",
            color: "var(--text-primary)",
            textDecoration: "none",
          }}
        >
          FormForge
        </Link>

        {/* NAV LINKS */}
        <div style={{ display: "flex", gap: "20px" }}>
          <Link
            to="/explore"
            style={{
              color: "var(--text-secondary)",
              fontWeight:
                location.pathname.startsWith("/explore") ? "600" : "400",
              textDecoration: "none",
            }}
          >
            Explore Forms
          </Link>

          {isLoggedIn && (
            <Link
              to="/forms"
              style={{
                color: "var(--text-secondary)",
                fontWeight:
                  location.pathname.startsWith("/forms") ? "600" : "400",
                textDecoration: "none",
              }}
            >
              Dashboard
            </Link>
          )}
        </div>

        {/* AUTH ACTION */}
        <div>
          {isLoggedIn === null ? null : !isLoggedIn ? (
            <a
              href="https://dynamic-form-builder-0dnd.onrender.com/auth/google"
              className="btn btn-primary"
            >
              Continue with Google
            </a>
          ) : (
            <button className="btn btn-secondary" onClick={handleLogout}>
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
