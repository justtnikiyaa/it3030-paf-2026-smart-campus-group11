import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import authService from "../services/authService";

export const AuthContext = createContext(null);

function mapBackendUser(me) {
  if (!me) return null;

  let role = "USER";
  if (me.roles?.includes("ADMIN")) role = "ADMIN";
  else if (me.roles?.includes("TECHNICIAN")) role = "TECHNICIAN";

  return {
    id: me.id,
    email: me.email,
    fullName: me.fullName,
    pictureUrl: me.pictureUrl,
    roles: me.roles ?? [],
    role
  };
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState({
    id: 1,
    email: "local@smartcampus.com",
    fullName: "Local Admin",
    pictureUrl: "",
    role: "ADMIN"
  });
  const [isAuthLoading, setIsAuthLoading] = useState(false);

  const refreshCurrentUser = useCallback(async () => {
    const me = await authService.getMe();

    if (!me) {
      setUser(null);
      return null;
    }

    const normalized = mapBackendUser(me);
    setUser(normalized);
    return normalized;
  }, []);

  useEffect(() => {
    // Disabled authentication bootstrap for local UI testing
    // bootstrap();
  }, []);

  const loginWithGoogle = useCallback(() => {
    authService.loginWithGoogle();
  }, []);

  const finalizeOAuthLogin = useCallback(async () => {
    setIsAuthLoading(true);

    for (let attempt = 0; attempt < 3; attempt += 1) {
      try {
        const current = await refreshCurrentUser();
        if (current) {
          setIsAuthLoading(false);
          return current;
        }
      } catch {
        // Retry a few times to handle session propagation timing.
      }

      await sleep(350);
    }

    setIsAuthLoading(false);
    return null;
  }, [refreshCurrentUser]);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } finally {
      setUser(null);
      setIsAuthLoading(false);
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      role: user?.role || null,
      isAuthenticated: Boolean(user),
      isAuthLoading,
      loginWithGoogle,
      finalizeOAuthLogin,
      refreshCurrentUser,
      logout
    }),
    [
      user,
      isAuthLoading,
      loginWithGoogle,
      finalizeOAuthLogin,
      refreshCurrentUser,
      logout
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
