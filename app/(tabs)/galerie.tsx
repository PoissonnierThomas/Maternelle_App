import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Modal,
  RefreshControl,
  SectionList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { FavoritePhoto, Galerie, useData } from "../_DataContext";

const IMAGE_BASE = "https://sebastien-thon.fr/prince/images/";
const SCREEN_WIDTH = Dimensions.get("window").width;
const PRIMARY = "#4A90D9";
const GOLD = "#F5A623";
const BG = "#EBF4FF";

type Section = {
  galerie: Galerie;
  data: FavoritePhoto[];
};

export default function GalerieScreen() {
  const { fetchWithAuth, togglePhotoFavorite, isPhotoFavorite } = useData();
  const [refreshing, setRefreshing] = useState(false);
  const [galeries, setGaleries] = useState<Galerie[]>([]);
  const [zoomedPhoto, setZoomedPhoto] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    const json = await fetchWithAuth();
    if (json?.galeries) setGaleries(json.galeries);
  }, [fetchWithAuth]);

  useEffect(() => { loadData(); }, [loadData]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, [loadData]);

  if (galeries.length === 0 && !refreshing)
    return <ActivityIndicator style={styles.loader} color={PRIMARY} size="large" />;

  const sections: Section[] = galeries.map((g) => ({
    galerie: g,
    data: g.photos.map((p) => ({
      image: p.image,
      legende: p.legende,
      galerieTitle: g.titre,
    })),
  }));

  return (
    <>
      <SectionList
        style={{ backgroundColor: BG }}
        sections={sections}
        keyExtractor={(item, i) => item.image + i}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[PRIMARY]} />}
        renderSectionHeader={({ section }) => {
          const g = section.galerie;
          return (
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{g.titre}</Text>
              <Text style={styles.sectionMeta}>
                {new Date(g.date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                {" · "}
                {g.classe === 0 ? "Toute l'école" : `Classe ${g.classe}`}
              </Text>
              {g.texte ? <Text style={styles.sectionTexte}>{g.texte}</Text> : null}
            </View>
          );
        }}
        renderItem={({ item }) => {
          const fav = isPhotoFavorite(item.image);
          return (
            <View style={styles.photoCard}>
              <TouchableOpacity onPress={() => setZoomedPhoto(item.image)}>
                <Image
                  source={{ uri: IMAGE_BASE + item.image }}
                  style={styles.photo}
                  resizeMode="cover"
                />
              </TouchableOpacity>
              <View style={styles.photoFooter}>
                {item.legende ? (
                  <Text style={styles.legende}>{item.legende}</Text>
                ) : (
                  <View />
                )}
                <TouchableOpacity onPress={() => togglePhotoFavorite(item)}>
                  <Text style={[styles.favStar, fav && styles.favActive]}>
                    {fav ? "★" : "☆"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
      />

      {/* Visionneuse plein écran */}
      <Modal visible={!!zoomedPhoto} transparent animationType="fade">
        <View style={styles.modalBg}>
          <ScrollView
            maximumZoomScale={4}
            minimumZoomScale={1}
            centerContent
            contentContainerStyle={styles.modalContent}
          >
            <Image
              source={{ uri: IMAGE_BASE + zoomedPhoto }}
              style={styles.fullImage}
              resizeMode="contain"
            />
          </ScrollView>
          <TouchableOpacity style={styles.closeBtn} onPress={() => setZoomedPhoto(null)}>
            <Ionicons name="close-circle" size={42} color="#fff" />
          </TouchableOpacity>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  loader: { flex: 1, marginTop: 40 },
  sectionHeader: {
    paddingHorizontal: 16, paddingTop: 20, paddingBottom: 10,
    backgroundColor: PRIMARY,
  },
  sectionTitle: { fontSize: 18, fontWeight: "bold", color: "#fff" },
  sectionMeta: { fontSize: 12, color: "rgba(255,255,255,0.75)", marginTop: 2 },
  sectionTexte: { fontSize: 13, color: "rgba(255,255,255,0.9)", marginTop: 4 },
  photoCard: {
    marginHorizontal: 12, marginBottom: 12, borderRadius: 16,
    overflow: "hidden", backgroundColor: "#fff",
    shadowColor: PRIMARY, shadowOpacity: 0.1, shadowRadius: 6, elevation: 3,
  },
  photo: { width: SCREEN_WIDTH - 24, height: (SCREEN_WIDTH - 24) * 0.65 },
  photoFooter: {
    flexDirection: "row", justifyContent: "space-between",
    alignItems: "center", paddingHorizontal: 14, paddingVertical: 10,
  },
  legende: { fontSize: 13, color: "#1A3A5C", flex: 1 },
  favStar: { fontSize: 26, color: "#c8dff5", paddingLeft: 8 },
  favActive: { color: GOLD },
  modalBg: { flex: 1, backgroundColor: "rgba(0,0,0,0.92)" },
  modalContent: { flex: 1, alignItems: "center", justifyContent: "center" },
  fullImage: { width: SCREEN_WIDTH, height: SCREEN_WIDTH },
  closeBtn: { position: "absolute", top: 50, right: 16 },
});
