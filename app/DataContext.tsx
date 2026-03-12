import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

const BASE_URL = "https://sebastien-thon.fr/prince";

type DataContextType = {
  login: string;
  password: string;
  apiUrl: string;
  savedCredentials: { login: string; password: string } | null;
  signIn: (
    login: string,
    password: string,
    rememberMe: boolean
  ) => Promise<string | null>;
  signOut: () => void;
};

const DataContext = createContext<DataContextType | null>(null);

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used inside DataProvider");
  return ctx;
}

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [savedCredentials, setSavedCredentials] = useState<{
    login: string;
    password: string;
  } | null>(null);

  useEffect(() => {
    AsyncStorage.getItem("savedCredentials").then((val) => {
      if (val) setSavedCredentials(JSON.parse(val));
    });
  }, []);

  const apiUrl = login
    ? `${BASE_URL}/index.php?login=${encodeURIComponent(login)}&mdp=${encodeURIComponent(password)}`
    : "";

  const signIn = async (
    inputLogin: string,
    inputPassword: string,
    rememberMe: boolean
  ): Promise<string | null> => {
    try {
      const res = await fetch(
        `${BASE_URL}/index.php?connexion&login=${encodeURIComponent(inputLogin)}&mdp=${encodeURIComponent(inputPassword)}`
      );
      const json = await res.json();

      if (json.erreur) return json.erreur;

      setLogin(inputLogin);
      setPassword(inputPassword);

      if (rememberMe) {
        const creds = { login: inputLogin, password: inputPassword };
        await AsyncStorage.setItem("savedCredentials", JSON.stringify(creds));
        setSavedCredentials(creds);
      } else {
        await AsyncStorage.removeItem("savedCredentials");
        setSavedCredentials(null);
      }

      return null;
    } catch {
      return "Erreur réseau. Vérifiez votre connexion.";
    }
  };

  const signOut = () => {
    setLogin("");
    setPassword("");
  };

  return (
    <DataContext.Provider
      value={{ login, password, apiUrl, savedCredentials, signIn, signOut }}
    >
      {children}
    </DataContext.Provider>
  );
}
