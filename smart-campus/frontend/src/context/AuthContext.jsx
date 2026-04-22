import { createContext, useEffect, useMemo, useState } from "react";
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

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  const refreshCurrentUser = async () => {
    const me = await authService.getMe();

    if (!me) {
      setUser(null);
      return null;
    }

    const normalized = mapBackendUser(me);
    setUser(normalized);
    return normalized;
  };

  useEffect(() => {
    let active = true;

    async function bootstrap() {
      try {
        const current = await authService.getMe();
        if (!active) return;
        setUser(mapBackendUser(current));
      } catch {
        if (active) setUser(null);
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
      refreshCurrentUser,
      logout
    }),
    [user, isAuthLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
