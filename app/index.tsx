import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { useData } from "./_DataContext";

const PRIMARY = "#4A90D9";
const GOLD = "#F5A623";
const BG = "#EBF4FF";

export default function ConnexionScreen() {
  const { savedCredentials, signIn } = useData();
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    if (savedCredentials) {
      setLogin(savedCredentials.login);
      setPassword(savedCredentials.password);
      setRememberMe(true);
    }
  }, [savedCredentials]);

  const handleLogin = async () => {
    const error = await signIn(login, password, rememberMe);
    if (error) {
      Alert.alert("Erreur de connexion", error);
    } else {
      router.replace("/(tabs)/accueil");
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: BG }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.container}>
        <Image
          source={require("../assets/images/petitPrince.png")}
          style={styles.image}
        />
        <Text style={styles.appName}>Le Petit Prince</Text>
        <Text style={styles.subtitle}>Espace parents</Text>

        <View style={styles.card}>
          <Text style={styles.label}>Identifiant</Text>
          <TextInput
            value={login}
            style={styles.input}
            onChangeText={setLogin}
            autoCapitalize="none"
            placeholder="ex : classe1"
            placeholderTextColor="#aac4e0"
          />
          <Text style={styles.label}>Mot de passe</Text>
          <TextInput
            value={password}
            style={styles.input}
            onChangeText={setPassword}
            secureTextEntry
            placeholder="••••••"
            placeholderTextColor="#aac4e0"
          />
          <View style={styles.row}>
            <Text style={styles.rememberText}>Se souvenir de moi</Text>
            <Switch
              value={rememberMe}
              onValueChange={setRememberMe}
              trackColor={{ false: "#ccc", true: PRIMARY }}
              thumbColor={rememberMe ? GOLD : "#f4f3f4"}
            />
          </View>
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Se connecter</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    backgroundColor: BG,
  },
  image: {
    width: 140,
    height: 140,
    resizeMode: "contain",
    marginBottom: 12,
  },
  appName: {
    fontSize: 28,
    fontWeight: "bold",
    color: PRIMARY,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 14,
    color: "#7A8FA6",
    marginBottom: 28,
  },
  card: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 24,
    shadowColor: PRIMARY,
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: PRIMARY,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1.5,
    borderColor: "#c8dff5",
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    fontSize: 15,
    color: "#1A3A5C",
    backgroundColor: "#F5FAFF",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  rememberText: {
    fontSize: 14,
    color: "#1A3A5C",
  },
  button: {
    backgroundColor: PRIMARY,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    shadowColor: PRIMARY,
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
});
