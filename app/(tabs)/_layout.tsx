import { Ionicons } from "@expo/vector-icons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { Tabs } from "expo-router";
import React from "react";
import { Image, Pressable, Text, View } from "react-native";

import { useClientOnlyValue } from "@/components/useClientOnlyValue";
import { useData } from "../_DataContext";

const PRIMARY = "#4A90D9";
const GOLD = "#F5A623";

function HeaderTitle({ title }: { title: string }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
      <Image
        source={require("../../assets/images/petitPrince.png")}
        style={{ width: 34, height: 34, resizeMode: "contain", borderRadius: 17 }}
      />
      <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 18 }}>{title}</Text>
    </View>
  );
}

function LogoutButton() {
  const { signOut } = useData();
  return (
    <Pressable onPress={signOut} style={{ marginRight: 15 }}>
      {({ pressed }) => (
        <Ionicons
          name="log-out-outline"
          size={24}
          color="#fff"
          style={{ opacity: pressed ? 0.5 : 1 }}
        />
      )}
    </Pressable>
  );
}


export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: GOLD,
        tabBarInactiveTintColor: "#a0c4e8",
        tabBarStyle: {
          backgroundColor: PRIMARY,
          borderTopWidth: 0,
          elevation: 8,
          shadowOpacity: 0.2,
          height: 60,
          paddingBottom: 6,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
        },
        headerShown: useClientOnlyValue(false, true),
        headerStyle: { backgroundColor: PRIMARY },
        headerTintColor: "#fff",
        headerTitleStyle: { fontWeight: "bold", fontSize: 18 },
        headerTitle: ({ children }) => <HeaderTitle title={children} />,
        headerRight: () => <LogoutButton />,
      }}
    >
      <Tabs.Screen
        name="accueil"
        options={{
          title: "Accueil",
          tabBarIcon: ({ color }) => <Ionicons name="home" size={26} color={color} />,
        }}
      />
      <Tabs.Screen
        name="articles"
        options={{
          title: "Articles",
          tabBarIcon: ({ color }) => <Ionicons name="book" size={26} color={color} />,
        }}
      />
      <Tabs.Screen
        name="galerie"
        options={{
          title: "Galerie",
          tabBarIcon: ({ color }) => <Ionicons name="camera" size={26} color={color} />,
        }}
      />
      <Tabs.Screen
        name="dates"
        options={{
          title: "Dates",
          tabBarIcon: ({ color }) => <Ionicons name="calendar" size={26} color={color} />,
        }}
      />
      <Tabs.Screen
        name="contact"
        options={{
          title: "Contact",
          tabBarIcon: ({ color }) => <FontAwesome6 name="contact-book" size={22} color={color} />,
        }}
      />
    </Tabs>
  );
}
