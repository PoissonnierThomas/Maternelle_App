import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";

const BASE_URL = "https://sebastien-thon.fr/prince";

export type Photo = { image: string; legende: string };

export type Article = {
  id: number;
  titre: string;
  date: string;
  categorie: string;
  important: boolean;
  classe: number;
  texte: string;
  photos: Photo[];
};

export type Galerie = {
  titre: string;
  date: string;
  classe: number;
  texte: string;
  photos: Photo[];
};

export type FavoritePhoto = {
  image: string;
  legende: string;
  galerieTitle: string;
};

export type DateItem = {
  titre: string;
  date: string;
  classe: number;
  texte: string;
};

type DataContextType = {
  login: string;
  password: string;
  apiUrl: string;
  savedCredentials: { login: string; password: string } | null;
  signIn: (login: string, password: string, rememberMe: boolean) => Promise<string | null>;
  signOut: () => void;
  fetchWithAuth: () => Promise<any | null>;
  articles: Article[];
  setArticles: (a: Article[]) => void;
  favoriteArticles: Article[];
  favoritePhotos: FavoritePhoto[];
  favoriteDates: DateItem[];
  toggleArticleFavorite: (article: Article) => void;
  togglePhotoFavorite: (photo: FavoritePhoto) => void;
  toggleDateFavorite: (date: DateItem) => void;
  isArticleFavorite: (id: number) => boolean;
  isPhotoFavorite: (image: string) => boolean;
  isDateFavorite: (titre: string) => boolean;
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
  const [savedCredentials, setSavedCredentials] = useState<{ login: string; password: string } | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [favoriteArticles, setFavoriteArticles] = useState<Article[]>([]);
  const [favoritePhotos, setFavoritePhotos] = useState<FavoritePhoto[]>([]);
  const [favoriteDates, setFavoriteDates] = useState<DateItem[]>([]);

  useEffect(() => {
    AsyncStorage.getItem("savedCredentials").then((val) => {
      if (val) setSavedCredentials(JSON.parse(val));
    });
  }, []);

  useEffect(() => {
    if (!login) {
      setFavoriteArticles([]);
      setFavoritePhotos([]);
      setFavoriteDates([]);
      return;
    }
    AsyncStorage.getItem(`${login}_favoriteArticles`).then((val) => {
      if (val) setFavoriteArticles(JSON.parse(val));
      else setFavoriteArticles([]);
    });
    AsyncStorage.getItem(`${login}_favoritePhotos`).then((val) => {
      if (val) setFavoritePhotos(JSON.parse(val));
      else setFavoritePhotos([]);
    });
    AsyncStorage.getItem(`${login}_favoriteDates`).then((val) => {
      if (val) setFavoriteDates(JSON.parse(val));
      else setFavoriteDates([]);
    });
  }, [login]);

  const apiUrl = login
    ? `${BASE_URL}/index.php?login=${encodeURIComponent(login)}&mdp=${encodeURIComponent(password)}`
    : "";

  const signOut = useCallback(() => {
    setLogin("");
    setPassword("");
    setArticles([]);
  }, []);

  const fetchWithAuth = useCallback(async (): Promise<any | null> => {
    if (!apiUrl) return null;
    try {
      const r = await fetch(apiUrl);
      const json = await r.json();
      if (json.erreur) {
        signOut();
        return null;
      }
      return json;
    } catch {
      return null;
    }
  }, [apiUrl, signOut]);

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

  const toggleArticleFavorite = useCallback((article: Article) => {
    setFavoriteArticles((prev) => {
      const exists = prev.some((a) => a.id === article.id);
      const next = exists ? prev.filter((a) => a.id !== article.id) : [...prev, article];
      AsyncStorage.setItem(`${login}_favoriteArticles`, JSON.stringify(next));
      return next;
    });
  }, [login]);

  const togglePhotoFavorite = useCallback((photo: FavoritePhoto) => {
    setFavoritePhotos((prev) => {
      const exists = prev.some((p) => p.image === photo.image);
      const next = exists ? prev.filter((p) => p.image !== photo.image) : [...prev, photo];
      AsyncStorage.setItem(`${login}_favoritePhotos`, JSON.stringify(next));
      return next;
    });
  }, [login]);

  const toggleDateFavorite = useCallback((date: DateItem) => {
    setFavoriteDates((prev) => {
      const exists = prev.some((d) => d.titre === date.titre);
      const next = exists ? prev.filter((d) => d.titre !== date.titre) : [...prev, date];
      AsyncStorage.setItem(`${login}_favoriteDates`, JSON.stringify(next));
      return next;
    });
  }, [login]);

  const isArticleFavorite = useCallback(
    (id: number) => favoriteArticles.some((a) => a.id === id),
    [favoriteArticles]
  );
  const isPhotoFavorite = useCallback(
    (image: string) => favoritePhotos.some((p) => p.image === image),
    [favoritePhotos]
  );
  const isDateFavorite = useCallback(
    (titre: string) => favoriteDates.some((d) => d.titre === titre),
    [favoriteDates]
  );

  return (
    <DataContext.Provider
      value={{
        login, password, apiUrl, savedCredentials, signIn, signOut, fetchWithAuth,
        articles, setArticles,
        favoriteArticles, favoritePhotos, favoriteDates,
        toggleArticleFavorite, togglePhotoFavorite, toggleDateFavorite,
        isArticleFavorite, isPhotoFavorite, isDateFavorite,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}
