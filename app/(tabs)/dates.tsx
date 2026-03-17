import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { DateItem, useData } from "../_DataContext";

const PRIMARY = "#4A90D9";
const GOLD = "#F5A623";
const BG = "#EBF4FF";

export default function DatesScreen() {
  const { fetchWithAuth, toggleDateFavorite, isDateFavorite } = useData();
  const [refreshing, setRefreshing] = useState(false);
  const [items, setData] = useState<{ dates: DateItem[] } | null>(null);

  const loadData = useCallback(async () => {
    const json = await fetchWithAuth();
    if (json) setData(json);
  }, [fetchWithAuth]);

  useEffect(() => { loadData(); }, [loadData]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, [loadData]);

  if (!items) return <ActivityIndicator style={styles.loader} color={PRIMARY} size="large" />;

  return (
    <FlatList
      style={{ backgroundColor: BG }}
      data={items.dates}
      keyExtractor={(_, i) => i.toString()}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[PRIMARY]} />}
      renderItem={({ item }) => {
        const fav = isDateFavorite(item.titre);
        return (
          <View style={styles.card}>
            <View style={styles.dateStripe}>
              <Text style={styles.dateDay}>
                {new Date(item.date).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}
              </Text>
              <Text style={styles.dateYear}>{new Date(item.date).getFullYear()}</Text>
            </View>

            <View style={styles.content}>
              <Text style={styles.titre}>{item.titre}</Text>
              <Text style={styles.classe}>
                {item.classe === 0 ? "Toute l'école" : `Classe ${item.classe}`}
              </Text>
              <Text style={styles.texte}>{item.texte}</Text>
              <TouchableOpacity style={styles.favBtn} onPress={() => toggleDateFavorite(item)}>
                <Text style={[styles.favText, fav && styles.favActive]}>
                  {fav ? "★ Retirer des favoris" : "☆ Ajouter aux favoris"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  loader: { flex: 1, marginTop: 40 },
  card: {
    flexDirection: "row", margin: 12, backgroundColor: "#fff",
    borderRadius: 16, overflow: "hidden",
    shadowColor: PRIMARY, shadowOpacity: 0.1, shadowRadius: 6, elevation: 3,
  },
  dateStripe: {
    backgroundColor: GOLD, width: 70,
    alignItems: "center", justifyContent: "center", paddingVertical: 16,
  },
  dateDay: { color: "#fff", fontSize: 13, fontWeight: "bold", textAlign: "center" },
  dateYear: { color: "rgba(255,255,255,0.75)", fontSize: 11, textAlign: "center" },
  content: { flex: 1, padding: 14 },
  titre: { fontSize: 16, fontWeight: "bold", color: "#1A3A5C", marginBottom: 4 },
  classe: { fontSize: 12, color: "#7A8FA6", marginBottom: 8 },
  texte: { fontSize: 14, lineHeight: 20, color: "#1A3A5C" },
  favBtn: { marginTop: 10, alignSelf: "flex-start" },
  favText: { fontSize: 14, color: "#b0c4d8" },
  favActive: { color: GOLD, fontWeight: "bold" },
});
