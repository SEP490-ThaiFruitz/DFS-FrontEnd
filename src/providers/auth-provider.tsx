"use client";

import {
  Dispatch,
  SetStateAction,
  createContext,
  use,
  useContext,
  useEffect,
  useState,
} from "react";
import { jwtDecode } from "jwt-decode";
import { useCookie, useLocalStorage } from "react-use";

export type DecodeData = {
  Id: string;
  Name: string;
  Email: string;
  Avatar: string;
  Role: string;
  exp: number;
  iss: string;
  aud: string;
};

export type AuthContextType = {
  setToken: Dispatch<SetStateAction<string | null>>;
  setUser: Dispatch<SetStateAction<DecodeData | null>>;
  token: string | null;
  user: DecodeData | null;

  value: unknown;
  setValue: Dispatch<SetStateAction<unknown>>;

  removeInfoUser: () => void;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<DecodeData | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode<DecodeData>(token);
        setUser(decoded);
        setValue(decoded);
      } catch (error) {
        console.error("Failed to decode token:", error);
      }
    } else {
      setUser(null);
      return undefined;
    }
  }, [token]);

  const [value, setValue, remove] = useLocalStorage("user");

  // console.log({ userDecoded: user });
  return (
    <AuthContext.Provider
      value={{
        setUser,
        user,
        setToken,
        token,
        value,
        setValue,
        removeInfoUser: remove,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
