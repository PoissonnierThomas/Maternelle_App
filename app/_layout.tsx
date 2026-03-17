import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/components/useColorScheme';
import { DataProvider, useData } from './_DataContext';

export {
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  initialRouteName: 'index',
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function AuthGuard() {
  const { login } = useData();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    const inApp = segments[0] === '(tabs)' || segments[0] === 'article';
    if (!login && inApp) {
      router.replace('/');
    }
  }, [login, segments]);

  return null;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <DataProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <AuthGuard />
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="article/[id]"
            options={{
              title: "Article",
              headerStyle: { backgroundColor: "#4A90D9" },
              headerTintColor: "#fff",
              headerTitleStyle: { fontWeight: "bold" },
            }}
          />
          <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
        </Stack>
      </ThemeProvider>
    </DataProvider>
  );
}
