import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet, TextInput, Button } from 'react-native';
import React, { useState } from 'react';

import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';

export default function ModalScreen() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");

  const onLoginChange = (t : string) => {
    setLogin(t);
  }

  const onPasswordChange = (t : string) => {
    setPassword(t);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Connexion</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <Text style={{marginBottom:2}}>Login</Text>
      <TextInput
        value={login}
        style={{width:"50%", borderWidth: 1, borderColor: "#ccc", padding: 10, borderRadius: 8 }}
        onChangeText={onLoginChange}
      />
      <Text style={{marginBottom:2}}>Mot de passe</Text>
      <TextInput
        value={password}
        style={{width:"50%", borderWidth: 1, borderColor: "#ccc", padding: 10, borderRadius: 8 }}
        onChangeText={onPasswordChange}
      />
      <Button
        onPress={() => {}}
        title="Se connecter"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
