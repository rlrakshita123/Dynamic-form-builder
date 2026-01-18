import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/*
  WHAT THIS FILE DOES:
  1. Shows correct auth UI based on backend session.
  2. Prevents false login/logout states.
  3. Keeps navbar professional & stable.
  4. Mirrors real SaaS behavior.
*/

export default function Navbar() {
  const { isLoggedIn, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await fetch(
      "https://dynamic-form-builder-0dnd.onrender.com/auth/logout",
      { credentials: "include" }
    );
    navigate("/");
    window.location.reload();
  };

  if (loading) return null; // prevent flicker

  return (
    <nav style={{
      position: "sticky",
      top: 0,
      zIndex: 100,
      background: "var(--bg-primary)",
      borderBottom: "1px solid var(--border-color)"
    }}>
      <div className="container" style={{
        height: "72px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <Link
          to={isLoggedIn ? "/forms" : "/"}
          style={{ fontSize: "22px", fontWeight: 800 }}
        >
          FormForge
        </Link>

        <div style={{ display: "flex", gap: "20px" }}>
          <Link to="/explore">Explore Forms</Link>
          {isLoggedIn && <Link to="/forms">Dashboard</Link>}
        </div>

        {!isLoggedIn ? (
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
    </nav>
  );
}
