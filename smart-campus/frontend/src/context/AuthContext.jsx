import { createContext, useEffect, useMemo, useState } from "react";
import authService from "../services/authService";

export const AuthContext = createContext(null);

const STORAGE_KEY = "smartcampus_auth_user";

function mapBackendUser(me) {
  if (!me) return null;

  const role = me.roles?.includes("ADMIN") ? "ADMIN" : "USER";
  return {
    id: me.id,
    email: me.email,
    fullName: me.fullName,
    pictureUrl: me.pictureUrl,
    role
  };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  const refreshCurrentUser = async () => {
    const me = await authService.getMe();

    if (!me) {
      setUser(null);
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }

    const normalized = mapBackendUser(me);
    setUser(normalized);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
    return normalized;
  };

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }

    let active = true;

    async function bootstrap() {
      try {
        await refreshCurrentUser();
      } catch {
        // Keep local storage fallback if backend is temporarily unavailable.
      } finally {
        if (active) setIsAuthLoading(false);
      }
    }

    bootstrap();
    return () => {
      active = false;
    };
  }, []);

  const loginWithGoogle = () => authService.loginWithGoogle();

  const finalizeOAuthLogin = async () => {
    const current = await refreshCurrentUser();
    setIsAuthLoading(false);
    return current;
  };

  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      setUser(null);
      localStorage.removeItem(STORAGE_KEY);
      setIsAuthLoading(false);
    }
  };

  const value = useMemo(
    () => ({
      user,
      role: user?.role || null,
      isAuthenticated: Boolean(user),
      isAuthLoading,
      loginWithGoogle,
      finalizeOAuthLogin,
      logout
    }),
    [user, isAuthLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
