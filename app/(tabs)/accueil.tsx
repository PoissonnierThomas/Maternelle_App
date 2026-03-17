import React from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";

import { Article, DateItem, FavoritePhoto, useData } from "../_DataContext";

const IMAGE_BASE = "https://sebastien-thon.fr/prince/images/";
const PRIMARY = "#4A90D9";
const GOLD = "#F5A623";
const ROSE = "#E91E8C";
const BG = "#EBF4FF";

function EmptyMessage({ text }: { text: string }) {
  return <Text style={styles.empty}>{text}</Text>;
}

function ArticleRow({ item }: { item: Article }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowTitle} numberOfLines={1}>{item.titre}</Text>
      <Text style={styles.rowMeta}>
        {new Date(item.date).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}
        {" · "}{item.categorie}
      </Text>
    </View>
  );
}

function PhotoRow({ item }: { item: FavoritePhoto }) {
  return (
    <View style={styles.photoRow}>
      <Image source={{ uri: IMAGE_BASE + item.image }} style={styles.thumb} resizeMode="cover" />
      <View style={styles.photoInfo}>
        <Text style={styles.rowTitle} numberOfLines={1}>{item.legende || item.image}</Text>
        <Text style={styles.rowMeta}>{item.galerieTitle}</Text>
      </View>
    </View>
  );
}

function DateRow({ item }: { item: DateItem }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowTitle} numberOfLines={1}>{item.titre}</Text>
      <Text style={styles.rowMeta}>
        {new Date(item.date).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })}
      </Text>
    </View>
  );
}

export default function HomeScreen() {
  const { favoriteArticles, favoritePhotos, favoriteDates } = useData();

  return (
    <ScrollView style={{ backgroundColor: BG }} contentContainerStyle={styles.container}>
      <Text style={styles.pageTitle}>Mes favoris</Text>

      <View style={[styles.section, { borderTopColor: PRIMARY }]}>
        <Text style={[styles.sectionTitle, { color: PRIMARY }]}>Articles</Text>
        {favoriteArticles.length === 0
          ? <EmptyMessage text="Aucun article en favori" />
          : favoriteArticles.map((a) => <ArticleRow key={a.id} item={a} />)
        }
      </View>

      <View style={[styles.section, { borderTopColor: ROSE }]}>
        <Text style={[styles.sectionTitle, { color: ROSE }]}>Photos</Text>
        {favoritePhotos.length === 0
          ? <EmptyMessage text="Aucune photo en favori" />
          : favoritePhotos.map((p) => <PhotoRow key={p.image} item={p} />)
        }
      </View>

      <View style={[styles.section, { borderTopColor: GOLD }]}>
        <Text style={[styles.sectionTitle, { color: GOLD }]}>Dates importantes</Text>
        {favoriteDates.length === 0
          ? <EmptyMessage text="Aucune date en favori" />
          : favoriteDates.map((d) => <DateRow key={d.titre} item={d} />)
        }
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, paddingBottom: 32 },
  pageTitle: {
    fontSize: 26, fontWeight: "bold", color: PRIMARY,
    marginBottom: 20, marginTop: 4,
  },
  section: {
    backgroundColor: "#fff", borderRadius: 16, padding: 16,
    marginBottom: 16, borderTopWidth: 4,
    shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 6, elevation: 3,
  },
  sectionTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 12 },
  empty: { fontSize: 13, color: "#aaa", fontStyle: "italic" },
  row: {
    paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: "#EBF4FF",
  },
  rowTitle: { fontSize: 14, fontWeight: "600", color: "#1A3A5C" },
  rowMeta: { fontSize: 12, color: "#7A8FA6", marginTop: 2 },
  photoRow: {
    flexDirection: "row", alignItems: "center",
    paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: "#EBF4FF",
  },
  thumb: { width: 60, height: 45, borderRadius: 8, marginRight: 12 },
  photoInfo: { flex: 1 },
});
