import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    Alert,
    Button,
    Image,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Switch,
    TextInput,
} from "react-native";

import { Text, View } from "@/components/Themed";
import { useData } from "./DataContext";

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
      router.replace("/(tabs)");
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.container}>
        <Image
          source={require("../assets/images/petitPrince.png")}
          style={styles.image}
        />
        <Text style={styles.title}>Connexion</Text>
        <View
          style={styles.separator}
          lightColor="#eee"
          darkColor="rgba(255,255,255,0.1)"
        />
        <Text style={{ marginBottom: 2 }}>Login</Text>
        <TextInput
          value={login}
          style={styles.input}
          onChangeText={setLogin}
          autoCapitalize="none"
        />
        <Text style={{ marginBottom: 2 }}>Mot de passe</Text>
        <TextInput
          value={password}
          style={styles.input}
          onChangeText={setPassword}
          secureTextEntry
        />
        <View style={styles.row}>
          <Text>Se souvenir de moi</Text>
          <Switch value={rememberMe} onValueChange={setRememberMe} />
        </View>
        <Button onPress={handleLogin} title="Se connecter" />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 48,
    paddingBottom: 48,
  },
  image: {
    width: 150,
    height: 150,
    resizeMode: "contain",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 5,
    height: 1,
    width: "80%",
  },
  input: {
    width: "50%",
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
});
