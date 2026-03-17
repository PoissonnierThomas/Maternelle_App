import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Linking, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const PRIMARY = "#4A90D9";
const GOLD = "#F5A623";
const BG = "#EBF4FF";

export default function ContactScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.schoolName}>École le Petit Prince</Text>
        <Text style={styles.address}>1, rue des écoles{"\n"}13000 Saint Exupéry</Text>
      </View>

      <View style={styles.card}>
        <TouchableOpacity
          style={styles.row}
          onPress={() => Linking.openURL("tel:0412345678")}
        >
          <View style={[styles.iconBox, { backgroundColor: PRIMARY + "22" }]}>
            <Ionicons name="call" size={22} color={PRIMARY} />
          </View>
          <View>
            <Text style={styles.rowLabel}>Téléphone</Text>
            <Text style={styles.rowValue}>04 12 34 56 78</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.separator} />

        <TouchableOpacity
          style={styles.row}
          onPress={() => Linking.openURL("mailto:contact@lepetitprince.fr")}
        >
          <View style={[styles.iconBox, { backgroundColor: GOLD + "33" }]}>
            <Ionicons name="mail" size={22} color={GOLD} />
          </View>
          <View>
            <Text style={styles.rowLabel}>Email</Text>
            <Text style={styles.rowValue}>contact@lepetitprince.fr</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: BG, padding: 24, justifyContent: "center",
  },
  header: {
    alignItems: "center", marginBottom: 32,
  },
  schoolName: {
    fontSize: 22, fontWeight: "bold", color: PRIMARY, marginBottom: 8,
  },
  address: {
    fontSize: 15, color: "#1A3A5C", textAlign: "center", lineHeight: 22,
  },
  card: {
    backgroundColor: "#fff", borderRadius: 20, padding: 8,
    shadowColor: PRIMARY, shadowOpacity: 0.12, shadowRadius: 10, elevation: 4,
  },
  row: {
    flexDirection: "row", alignItems: "center", padding: 16, gap: 16,
  },
  iconBox: {
    width: 48, height: 48, borderRadius: 14,
    alignItems: "center", justifyContent: "center",
  },
  rowLabel: { fontSize: 12, color: "#7A8FA6", marginBottom: 2 },
  rowValue: { fontSize: 15, fontWeight: "600", color: "#1A3A5C" },
  separator: { height: 1, backgroundColor: BG, marginHorizontal: 16 },
});
