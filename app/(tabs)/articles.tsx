import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { Article, useData } from "../_DataContext";

const PRIMARY = "#4A90D9";
const GOLD = "#F5A623";
const ROSE = "#E91E8C";
const BG = "#EBF4FF";

const CATEGORY_COLORS: Record<string, string> = {
  Information: PRIMARY,
  Absence: ROSE,
  Sortie: "#22C55E",
  Fête: GOLD,
};

export default function ArticlesScreen() {
  const { fetchWithAuth, setArticles, toggleArticleFavorite, isArticleFavorite } = useData();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [items, setData] = useState<Article[] | null>(null);
  const [search, setSearch] = useState("");

  const loadData = useCallback(async () => {
    const json = await fetchWithAuth();
    if (json?.articles) {
      setData(json.articles);
      setArticles(json.articles);
    }
  }, [fetchWithAuth]);

  useEffect(() => { loadData(); }, [loadData]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, [loadData]);

  if (!items) return <ActivityIndicator style={styles.loader} color={PRIMARY} size="large" />;

  const filtered = search.trim()
    ? items.filter((a) => {
        const q = search.toLowerCase();
        return a.titre.toLowerCase().includes(q) || a.texte.toLowerCase().includes(q);
      })
    : items;

  return (
    <FlatList
      style={{ backgroundColor: BG }}
      data={filtered}
      keyExtractor={(item) => item.id.toString()}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[PRIMARY]} />}
      ListHeaderComponent={
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher un article..."
            value={search}
            onChangeText={setSearch}
            placeholderTextColor="#7A8FA6"
            clearButtonMode="while-editing"
          />
        </View>
      }
      renderItem={({ item }) => {
        const fav = isArticleFavorite(item.id);
        const catColor = CATEGORY_COLORS[item.categorie] ?? PRIMARY;
        return (
          <TouchableOpacity
            style={[styles.card, { borderLeftColor: catColor }]}
            onPress={() => router.push({ pathname: "/article/[id]", params: { id: item.id } })}
            activeOpacity={0.85}
          >
            <View style={styles.header}>
              <Text style={styles.titre}>{item.titre}</Text>
              {item.important && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>Important</Text>
                </View>
              )}
            </View>

            <View style={styles.meta}>
              <View style={[styles.catTag, { backgroundColor: catColor + "22", borderColor: catColor }]}>
                <Text style={[styles.catText, { color: catColor }]}>{item.categorie}</Text>
              </View>
              <Text style={styles.metaText}>
                {new Date(item.date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
              </Text>
              <Text style={styles.metaText}>
                {" · "}{item.classe === 0 ? "Toute l'école" : `Classe ${item.classe}`}
              </Text>
            </View>

            <Text style={styles.texte} numberOfLines={2}>{item.texte}</Text>

            <View style={styles.footer}>
              <TouchableOpacity onPress={() => toggleArticleFavorite(item)}>
                <Text style={[styles.favText, fav && styles.favActive]}>
                  {fav ? "★ Favori" : "☆ Favori"}
                </Text>
              </TouchableOpacity>
              <Text style={styles.lireSuite}>Lire la suite →</Text>
            </View>
          </TouchableOpacity>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  loader: { flex: 1, marginTop: 40 },
  searchContainer: { padding: 12, paddingBottom: 4 },
  searchInput: {
    backgroundColor: "#fff", borderRadius: 14, paddingHorizontal: 16,
    paddingVertical: 11, fontSize: 15, borderWidth: 1.5, borderColor: "#c8dff5",
    color: "#1A3A5C",
  },
  card: {
    margin: 12, padding: 16, backgroundColor: "#fff",
    borderRadius: 16, borderLeftWidth: 5,
    shadowColor: PRIMARY, shadowOpacity: 0.1, shadowRadius: 6, elevation: 3,
  },
  header: { flexDirection: "row", alignItems: "center", flexWrap: "wrap", marginBottom: 8, gap: 8 },
  titre: { fontSize: 17, fontWeight: "bold", flex: 1, color: "#1A3A5C" },
  badge: { backgroundColor: "#FFF0F0", borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
  badgeText: { color: ROSE, fontSize: 11, fontWeight: "bold" },
  meta: { flexDirection: "row", flexWrap: "wrap", alignItems: "center", marginBottom: 8, gap: 6 },
  catTag: { borderRadius: 8, borderWidth: 1, paddingHorizontal: 8, paddingVertical: 2 },
  catText: { fontSize: 11, fontWeight: "700" },
  metaText: { fontSize: 12, color: "#7A8FA6" },
  texte: { fontSize: 14, lineHeight: 21, color: "#7A8FA6" },
  footer: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 12 },
  favText: { fontSize: 14, color: "#b0c4d8" },
  favActive: { color: GOLD, fontWeight: "bold" },
  lireSuite: { fontSize: 13, color: PRIMARY, fontWeight: "600" },
});
