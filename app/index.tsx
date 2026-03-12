import { Platform, StyleSheet, TextInput, Button, Image, Switch } from 'react-native';
import React, { useState } from 'react';
import { Link, Tabs, router } from 'expo-router';

import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';

export default function ConnexionScreen() {
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [stayConnected, setStayConnected] = useState(false);

    const onLoginChange = (t : string) => {
        setLogin(t);
    }

    const onPasswordChange = (t : string) => {
        
    }

    return (
        <View style={styles.container}>
        <Image
            source={require('../assets/images/petitPrince.png')}> 
        </Image>
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
                onPress={() => router.push("/(tabs)")} 
                title="Se connecter"
            />
            <Text>Rester Connecté ?</Text>
            <Switch
                value={stayConnected}
                onValueChange={setStayConnected}
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
