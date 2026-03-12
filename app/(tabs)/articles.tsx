import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useData } from "../DataContext";

type Photo = {
  image: string;
  legende: string;
};

type Article = {
  id: number;
  titre: string;
  date: string;
  categorie: string;
  important: boolean;
  classe: number;
  texte: string;
  photos: Photo[];
};

const IMAGE_BASE = "https://sebastien-thon.fr/prince/images/";

export default function ArticlesScreen() {
  const { apiUrl } = useData();
  const [refreshing, setRefreshing] = useState(false);
  const [items, setData] = useState<{ articles: Article[] } | null>(null);

  const loadData = useCallback(async () => {
    try {
      const r = await fetch(apiUrl);
      const json = await r.json();
      setData(json);
    } catch (e) {
      console.error(e);
    }
  }, [apiUrl]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = useCallback(async () => {
    try {
      setRefreshing(true);
      await loadData();
    } catch (e) {
      console.error(e);
    } finally {
      setRefreshing(false);
    }
  }, [loadData]);

  if (!items) return <ActivityIndicator style={styles.loader} />;

  return (
    <FlatList
      data={items.articles}
      keyExtractor={(item) => item.id.toString()}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      renderItem={({ item }) => (
        <View style={styles.card}>
          {/* En-tête */}
          <View style={styles.header}>
            <Text style={styles.titre}>{item.titre}</Text>
            {item.important && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>Important</Text>
              </View>
            )}
          </View>

          {/* Méta */}
          <View style={styles.meta}>
            <Text style={styles.metaText}>
              {new Date(item.date).toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </Text>
            <Text style={styles.metaText}> · {item.categorie}</Text>
            <Text style={styles.metaText}>
              {" · "}
              {item.classe === 0 ? "Toute l'école" : `Classe ${item.classe}`}
            </Text>
          </View>

          {/* Texte */}
          <Text style={styles.texte}>{item.texte}</Text>

          {/* Photos */}
          {item.photos.length > 0 && (
            <View style={styles.photosContainer}>
              {item.photos.map((photo, i) => (
                <View key={i} style={styles.photoWrapper}>
                  <Image
                    source={{ uri: IMAGE_BASE + photo.image }}
                    style={styles.photo}
                    resizeMode="cover"
                  />
                  {photo.legende ? (
                    <Text style={styles.legende}>{photo.legende}</Text>
                  ) : null}
                </View>
              ))}
            </View>
          )}
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    marginTop: 40,
  },
  card: {
    margin: 12,
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    marginBottom: 4,
    gap: 8,
  },
  titre: {
    fontSize: 18,
    fontWeight: "bold",
    flex: 1,
  },
  badge: {
    backgroundColor: "#e74c3c",
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  badgeText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "bold",
  },
  meta: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 10,
  },
  metaText: {
    fontSize: 12,
    color: "#777",
  },
  texte: {
    fontSize: 15,
    lineHeight: 22,
    color: "#333",
  },
  photosContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 12,
    gap: 8,
  },
  photoWrapper: {
    alignItems: "center",
  },
  photo: {
    width: 120,
    height: 90,
    borderRadius: 4,
  },
  legende: {
    fontSize: 11,
    color: "#555",
    marginTop: 2,
    maxWidth: 120,
    textAlign: "center",
  },
});
