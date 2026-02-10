import { useState } from "react";
import { AuthContext } from "./authContext";
import type { ReactNode } from "react";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [logedIn, setLogedIn] = useState<boolean>(
    Boolean(localStorage.getItem("token")),
  );

  const login = (token: string) => {
    localStorage.setItem("token", token);
    setLogedIn(true);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setLogedIn(false);
  };

  return (
    <AuthContext.Provider value={{ logedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
