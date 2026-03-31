import { createContext, useEffect, useMemo, useState } from "react";
import authService from "../services/authService";

export const AuthContext = createContext(null);

const STORAGE_KEY = "smartcampus_auth_user";

const demoUsers = {
  USER: { id: -1, email: "user@campus.edu", fullName: "User", role: "USER" },
  ADMIN: { id: -2, email: "admin@campus.edu", fullName: "Admin User", role: "ADMIN" }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

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
        const me = await authService.getMe();
        if (!active || !me) return;

        const role = me.roles?.includes("ADMIN") ? "ADMIN" : "USER";
        const fromBackend = {
          id: me.id,
          email: me.email,
          fullName: me.fullName,
          pictureUrl: me.pictureUrl,
          role
        };
        setUser(fromBackend);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(fromBackend));
      } catch {
        // Keep localStorage user fallback if backend me check fails.
      } finally {
        if (active) setIsAuthLoading(false);
      }
    }

    bootstrap();
    return () => {
      active = false;
    };
  }, []);

  const setUserFromOAuth = (oauthUser) => {
    setUser(oauthUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(oauthUser));
    setIsAuthLoading(false);
  };

  const loginWithGoogle = () => authService.loginWithGoogle();

  const loginAs = (role) => {
    const demo = demoUsers[role];
    setUser(demo);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(demo));
    setIsAuthLoading(false);
  };

  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      setUser(null);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const value = useMemo(
    () => ({
      user,
      role: user?.role || null,
      isAuthenticated: Boolean(user),
      isAuthLoading,
      loginWithGoogle,
      loginAs,
      logout,
      setUserFromOAuth
    }),
    [user, isAuthLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
