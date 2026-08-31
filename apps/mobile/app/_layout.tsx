import {
  HankenGrotesk_400Regular,
  HankenGrotesk_500Medium,
  HankenGrotesk_600SemiBold,
  HankenGrotesk_700Bold,
} from '@expo-google-fonts/hanken-grotesk';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import { QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { queryClient } from '../src/api/query-client';
import { useAuthStore } from '../src/stores/auth-store';
import { useOnboardingStore } from '../src/stores/onboarding-store';

void SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const restoreSession = useAuthStore((state) => state.restoreSession);
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const hydrateOnboarding = useOnboardingStore((state) => state.hydrate);
  const onboardingHydrated = useOnboardingStore((state) => state.isHydrated);
  const [fontsLoaded, fontError] = useFonts({
    HankenGrotesk_400Regular,
    HankenGrotesk_500Medium,
    HankenGrotesk_600SemiBold,
    HankenGrotesk_700Bold,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
    void restoreSession();
    void hydrateOnboarding();
  }, [hydrateOnboarding, restoreSession]);

  const ready = isHydrated && onboardingHydrated && (fontsLoaded || Boolean(fontError));

  useEffect(() => {
    if (ready) {
      void SplashScreen.hideAsync();
    }
  }, [ready]);

  return (
    <QueryClientProvider client={queryClient}>
      <StatusBar style="dark" />
      {ready ? <Stack screenOptions={{ headerShown: false }} /> : null}
    </QueryClientProvider>
  );
}
