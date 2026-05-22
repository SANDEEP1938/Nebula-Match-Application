import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NebulaSplash } from '../src/components/NebulaSplash';
import { AuthProvider, useAuth } from '../src/context/AuthContext';
import { colors } from '../src/theme/colors';

const SPLASH_MAX_MS = 3500;

SplashScreen.preventAutoHideAsync().catch(() => undefined);

const RootNavigator = () => {
  const { loading } = useAuth();
  const [splashVisible, setSplashVisible] = useState(true);

  const dismissSplash = useCallback(async () => {
    setSplashVisible(false);
    try {
      await SplashScreen.hideAsync();
    } catch {
      // Expo Go may not support native splash control
    }
  }, []);

  useEffect(() => {
    if (!loading) {
      void dismissSplash();
    }
  }, [loading, dismissSplash]);

  useEffect(() => {
    const timer = setTimeout(() => {
      void dismissSplash();
    }, SPLASH_MAX_MS);
    return () => clearTimeout(timer);
  }, [dismissSplash]);

  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.bg },
          headerTintColor: colors.text,
          headerTitleStyle: { fontWeight: '700' },
          contentStyle: { backgroundColor: colors.bg },
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ title: 'Sign in' }} />
        <Stack.Screen name="register" options={{ title: 'Create account' }} />
        <Stack.Screen name="forgot-password" options={{ title: 'Reset password' }} />
        <Stack.Screen name="play" options={{ title: 'Play' }} />
      </Stack>
      {splashVisible ? <NebulaSplash visible /> : null}
    </>
  );
};

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={styles.root}>
      <View style={styles.root}>
        <AuthProvider>
          <RootNavigator />
        </AuthProvider>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg,
  },
});
