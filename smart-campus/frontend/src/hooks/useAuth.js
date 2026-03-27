import { useMemo } from "react";

export default function useAuth() {
  return useMemo(() => ({ isAuthenticated: false, roles: [] }), []);
}
