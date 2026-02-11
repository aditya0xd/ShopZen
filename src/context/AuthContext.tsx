import { createContext } from "react";

export interface AuthContextType {
  logedIn: boolean;
  name: string;
  login: (token: string, name: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);
