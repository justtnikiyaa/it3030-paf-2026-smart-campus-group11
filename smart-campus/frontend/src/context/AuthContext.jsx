import { createContext } from "react";

const AuthContext = createContext({
  user: null,
  isAuthenticated: false,
  roles: [],
});

export default AuthContext;
