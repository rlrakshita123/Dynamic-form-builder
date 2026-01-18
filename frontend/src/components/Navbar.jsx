import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "../utils/axios";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(null); // null = loading

  useEffect(() => {
    axios
      .get("/auth/me")
      .then((res) => {
        setIsLoggedIn(res.data.authenticated);
      })
      .catch(() => {
        setIsLoggedIn(false);
      });
  }, []);

  const handleLogout = () => {
    // backend-less logout (cookie expiry)
    document.cookie =
      "app_user_id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    setIsLoggedIn(false);
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
