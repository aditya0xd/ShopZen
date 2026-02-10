import { createContext } from "react";

export interface AuthContextType {
  logedIn: boolean;
  login: (token: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);
