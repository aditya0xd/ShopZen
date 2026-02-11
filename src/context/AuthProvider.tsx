import { useState } from "react";
import { AuthContext } from "./AuthContext";
import type { ReactNode } from "react";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [logedIn, setLogedIn] = useState<boolean>(
    Boolean(localStorage.getItem("accessToken")),
  );
  const [name, setName] = useState<string>("");

  const login = (token: string, name: string) => {
    localStorage.setItem("accessToken", token);
    setLogedIn(true);
    setName(name);
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    setLogedIn(false);
  };

  return (
    <AuthContext.Provider value={{ logedIn, login, logout, name }}>
      {children}
    </AuthContext.Provider>
  );
};
