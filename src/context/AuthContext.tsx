import { createContext } from "react";

export interface AuthContextType {
  logedIn: boolean;
  name: string;
  login: (token: string, name: string, rememberMe?: boolean) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);
