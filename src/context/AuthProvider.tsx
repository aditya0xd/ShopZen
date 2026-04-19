import { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import type { ReactNode } from "react";

const ACCESS_TOKEN_KEY = "accessToken";
const AUTH_NAME_KEY = "authName";
const REMEMBER_ME_KEY = "rememberMe";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [logedIn, setLogedIn] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [initialized, setInitialized] = useState(false);

  // Restore session: from localStorage when "Remember me", else from sessionStorage (tab session)
  useEffect(() => {
    if (initialized) return;
    const rememberMe = localStorage.getItem(REMEMBER_ME_KEY) === "true";
    const token = rememberMe
      ? localStorage.getItem(ACCESS_TOKEN_KEY)
      : sessionStorage.getItem(ACCESS_TOKEN_KEY);
    const savedName =
      (rememberMe
        ? localStorage.getItem(AUTH_NAME_KEY)
        : sessionStorage.getItem(AUTH_NAME_KEY)) ?? "";
    if (token) {
      setLogedIn(true);
      setName(savedName);
    }
    setInitialized(true);
  }, [initialized]);

  const login = (token: string, name: string, rememberMe = false) => {
    if (rememberMe) {
      localStorage.setItem(ACCESS_TOKEN_KEY, token);
      localStorage.setItem(REMEMBER_ME_KEY, "true");
      if (name) {
        localStorage.setItem(AUTH_NAME_KEY, name);
      } else {
        localStorage.removeItem(AUTH_NAME_KEY);
      }
    } else {
      sessionStorage.setItem(ACCESS_TOKEN_KEY, token);
      if (name) {
        sessionStorage.setItem(AUTH_NAME_KEY, name);
      }
      localStorage.removeItem(REMEMBER_ME_KEY);
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      localStorage.removeItem(AUTH_NAME_KEY);
    }
    setLogedIn(true);
    setName(name || "");
  };

  const logout = () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(AUTH_NAME_KEY);
    localStorage.removeItem(REMEMBER_ME_KEY);
    sessionStorage.removeItem(ACCESS_TOKEN_KEY);
    sessionStorage.removeItem(AUTH_NAME_KEY);
    setLogedIn(false);
    setName("");
  };

  return (
    <AuthContext.Provider value={{ logedIn, login, logout, name }}>
      {children}
    </AuthContext.Provider>
  );
};
