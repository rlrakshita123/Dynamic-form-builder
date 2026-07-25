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

  const apiBaseUrl = import.meta.env.VITE_Api_Url || "https://dynamic-form-builder-0dnd.onrender.com";
  const googleAuthUrl = `${apiBaseUrl}/auth/google`;

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

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 w-full bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between">
        {/* BRAND */}
        <Link
          to={isLoggedIn ? "/forms" : "/"}
          className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 hover:opacity-90 transition-opacity"
        >
          FormForge
        </Link>

        {/* NAV LINKS */}
        <div className="flex items-center gap-6">
          <Link
            to="/explore"
            className={`text-sm font-medium transition-colors hover:text-indigo-400 ${
              location.pathname.startsWith("/explore")
                ? "text-indigo-400"
                : "text-slate-400"
            }`}
          >
            Explore Forms
          </Link>

          {isLoggedIn && (
            <Link
              to="/forms"
              className={`text-sm font-medium transition-colors hover:text-indigo-400 ${
                location.pathname.startsWith("/forms") || location.pathname.startsWith("/builder")
                  ? "text-indigo-400"
                  : "text-slate-400"
              }`}
            >
              Dashboard
            </Link>
          )}
        </div>

        {/* AUTH ACTION */}
        <div className="flex items-center gap-3">
          {isLoggedIn === null ? (
            <div className="w-24 h-9 bg-slate-800 rounded-lg animate-pulse" />
          ) : !isLoggedIn ? (
            <a
              href={googleAuthUrl}
              className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-500 transition-all shadow-md shadow-indigo-600/20 active:scale-[0.98] cursor-pointer"
            >
              Continue with Google
            </a>
          ) : (
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm border border-slate-800 hover:bg-slate-900 text-slate-300 rounded-lg font-medium transition-all active:scale-[0.98]"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
