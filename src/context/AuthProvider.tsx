import { useState } from "react";
import { AuthContext } from "./AuthContext";
import type { ReactNode } from "react";

const ACCESS_TOKEN_KEY = "accessToken";
const AUTH_NAME_KEY = "authName";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [logedIn, setLogedIn] = useState<boolean>(
    Boolean(localStorage.getItem(ACCESS_TOKEN_KEY)),
  );
  const [name, setName] = useState<string>(
    localStorage.getItem(AUTH_NAME_KEY) ?? "",
  );

  const login = (token: string, name: string) => {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
    if (name) {
      localStorage.setItem(AUTH_NAME_KEY, name);
    } else {
      localStorage.removeItem(AUTH_NAME_KEY);
    }
    setLogedIn(true);
    setName(name || "");
  };

  const logout = () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(AUTH_NAME_KEY);
    setLogedIn(false);
    setName("");
  };

  return (
    <AuthContext.Provider value={{ logedIn, login, logout, name }}>
      {children}
    </AuthContext.Provider>
  );
};
