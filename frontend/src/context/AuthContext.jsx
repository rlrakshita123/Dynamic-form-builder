import { createContext, useContext, useEffect, useState } from "react";
import axios from "../utils/axios";

/*
  WHAT THIS FILE DOES:
  1. Stores authentication state globally.
  2. Checks login status from backend safely.
  3. Prevents UI guessing auth via cookies.
  4. Acts as single source of truth for auth.
*/

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    axios.get("/auth/me")
      .then(res => {
        setIsLoggedIn(res.data.authenticated);
      })
      .catch(() => setIsLoggedIn(false))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
