import { createContext, useMemo, useState } from "react";

export const AuthContext = createContext(null);

const seedUser = {
  STUDENT: { name: "Nethmi Perera", email: "student@campus.edu", role: "STUDENT" },
  ADMIN: { name: "Admin User", email: "admin@campus.edu", role: "ADMIN" }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isSessionExpired, setIsSessionExpired] = useState(false);

  const loginWithRole = (role) => {
    setUser(seedUser[role]);
    setIsSessionExpired(false);
  };

  const logout = () => setUser(null);

  const expireSession = () => {
    setUser(null);
    setIsSessionExpired(true);
  };

  const value = useMemo(
    () => ({
      user,
      role: user?.role || null,
      isAuthenticated: Boolean(user),
      isSessionExpired,
      loginWithRole,
      logout,
      expireSession
    }),
    [user, isSessionExpired]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
