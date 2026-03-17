import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Dimensions,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useData } from "../_DataContext";

const IMAGE_BASE = "https://sebastien-thon.fr/prince/images/";
const PRIMARY = "#4A90D9";
const GOLD = "#F5A623";
const ROSE = "#E91E8C";
const BG = "#EBF4FF";
const SCREEN_WIDTH = Dimensions.get("window").width;

const CATEGORY_COLORS: Record<string, string> = {
  Information: PRIMARY,
  Absence: ROSE,
  Sortie: "#22C55E",
  Fête: GOLD,
};

export default function ArticleDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { articles, toggleArticleFavorite, isArticleFavorite } = useData();
  const router = useRouter();
  const [zoomedPhoto, setZoomedPhoto] = useState<string | null>(null);

  const article = articles.find((a) => a.id === Number(id));

  if (!article) {
    return (
      <View style={styles.notFound}>
        <Text style={styles.notFoundText}>Article introuvable.</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backLink}>← Retour</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const fav = isArticleFavorite(article.id);
  const catColor = CATEGORY_COLORS[article.categorie] ?? PRIMARY;

  return (
    <ScrollView style={{ backgroundColor: BG }} contentContainerStyle={styles.container}>
      {/* En-tête */}
      <View style={[styles.header, { borderLeftColor: catColor }]}>
        <View style={styles.headerTop}>
          <Text style={styles.titre}>{article.titre}</Text>
          {article.important && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Important</Text>
            </View>
          )}
        </View>

        <View style={styles.meta}>
          <View style={[styles.catTag, { backgroundColor: catColor + "22", borderColor: catColor }]}>
            <Text style={[styles.catText, { color: catColor }]}>{article.categorie}</Text>
          </View>
          <Text style={styles.metaText}>
            {new Date(article.date).toLocaleDateString("fr-FR", {
              day: "numeric", month: "long", year: "numeric",
            })}
          </Text>
          <Text style={styles.metaText}>
            {" · "}{article.classe === 0 ? "Toute l'école" : `Classe ${article.classe}`}
          </Text>
        </View>
      </View>

      {/* Texte */}
      <Text style={styles.texte}>{article.texte}</Text>

      {/* Photos */}
      {article.photos.length > 0 && (
        <View style={styles.photosSection}>
          <Text style={styles.photosTitle}>Photos</Text>
          {article.photos.map((photo, i) => (
            <TouchableOpacity key={i} onPress={() => setZoomedPhoto(photo.image)}>
              <Image
                source={{ uri: IMAGE_BASE + photo.image }}
                style={styles.photo}
                resizeMode="cover"
              />
              {photo.legende ? (
                <Text style={styles.legende}>{photo.legende}</Text>
              ) : null}
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Bouton favori */}
      <TouchableOpacity style={styles.favBtn} onPress={() => toggleArticleFavorite(article)}>
        <Text style={[styles.favText, fav && styles.favActive]}>
          {fav ? "★ Retirer des favoris" : "☆ Ajouter aux favoris"}
        </Text>
      </TouchableOpacity>

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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, paddingBottom: 40 },
  notFound: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: BG },
  notFoundText: { fontSize: 16, color: "#7A8FA6", marginBottom: 12 },
  backLink: { color: PRIMARY, fontSize: 15 },
  header: {
    backgroundColor: "#fff", borderRadius: 16, borderLeftWidth: 5,
    padding: 16, marginBottom: 16,
    shadowColor: PRIMARY, shadowOpacity: 0.08, shadowRadius: 6, elevation: 3,
  },
  headerTop: { flexDirection: "row", flexWrap: "wrap", alignItems: "flex-start", gap: 8, marginBottom: 10 },
  titre: { fontSize: 20, fontWeight: "bold", color: "#1A3A5C", flex: 1 },
  badge: { backgroundColor: "#FFF0F0", borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
  badgeText: { color: ROSE, fontSize: 11, fontWeight: "bold" },
  meta: { flexDirection: "row", flexWrap: "wrap", alignItems: "center", gap: 6 },
  catTag: { borderRadius: 8, borderWidth: 1, paddingHorizontal: 8, paddingVertical: 2 },
  catText: { fontSize: 11, fontWeight: "700" },
  metaText: { fontSize: 12, color: "#7A8FA6" },
  texte: { fontSize: 16, lineHeight: 26, color: "#1A3A5C", marginBottom: 24 },
  photosSection: { marginBottom: 24 },
  photosTitle: { fontSize: 16, fontWeight: "bold", color: PRIMARY, marginBottom: 12 },
  photo: { width: "100%", height: SCREEN_WIDTH * 0.6, borderRadius: 14, marginBottom: 6 },
  legende: { fontSize: 12, color: "#7A8FA6", textAlign: "center", marginBottom: 14 },
  favBtn: {
    alignSelf: "center", backgroundColor: "#fff", borderRadius: 14,
    paddingHorizontal: 24, paddingVertical: 12,
    shadowColor: GOLD, shadowOpacity: 0.2, shadowRadius: 6, elevation: 3,
  },
  favText: { fontSize: 15, color: "#b0c4d8", fontWeight: "600" },
  favActive: { color: GOLD },
  modalBg: { flex: 1, backgroundColor: "rgba(0,0,0,0.92)" },
  modalContent: { flex: 1, alignItems: "center", justifyContent: "center" },
  fullImage: { width: SCREEN_WIDTH, height: SCREEN_WIDTH },
  closeBtn: { position: "absolute", top: 50, right: 16 },
});
