import React, { useEffect } from 'react';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useMemoryStore } from '../src/store/useMemoryStore';
import { ShareIntentService } from '../src/services/capture/ShareIntentService';
import { colors } from '../src/constants/theme';

export default function RootLayout() {
  const router = useRouter();
  const init = useMemoryStore((state) => state.init);

  useEffect(() => {
    init();
    ShareIntentService.init(router);
  }, [init, router]);

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
          animation: 'fade',
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="capture/modal"
          options={{
            presentation: 'modal',
            headerShown: false,
            animation: 'slide_from_bottom',
          }}
        />
        <Stack.Screen
          name="capture/screenshot"
          options={{
            headerShown: true,
            title: 'Capture Screenshot',
            headerTintColor: colors.textPrimary,
            headerStyle: { backgroundColor: colors.background },
            headerShadowVisible: false,
          }}
        />
        <Stack.Screen
          name="capture/link"
          options={{
            headerShown: true,
            title: 'Save Link',
            headerTintColor: colors.textPrimary,
            headerStyle: { backgroundColor: colors.background },
            headerShadowVisible: false,
          }}
        />
        <Stack.Screen
          name="capture/note"
          options={{
            headerShown: true,
            title: 'Quick Note',
            headerTintColor: colors.textPrimary,
            headerStyle: { backgroundColor: colors.background },
            headerShadowVisible: false,
          }}
        />
        <Stack.Screen
          name="capture/shared"
          options={{
            headerShown: true,
            title: 'Incoming Capture',
            headerTintColor: colors.textPrimary,
            headerStyle: { backgroundColor: colors.background },
            headerShadowVisible: false,
          }}
        />
        <Stack.Screen
          name="calls/index"
          options={{
            headerShown: true,
            title: 'Call Intelligence',
            headerTintColor: colors.textPrimary,
            headerStyle: { backgroundColor: colors.background },
            headerShadowVisible: false,
          }}
        />
        <Stack.Screen
          name="calls/import"
          options={{
            headerShown: true,
            title: 'Import Call',
            headerTintColor: colors.textPrimary,
            headerStyle: { backgroundColor: colors.background },
            headerShadowVisible: false,
          }}
        />
        <Stack.Screen
          name="calls/[id]"
          options={{
            headerShown: true,
            title: 'Call Inspector',
            headerTintColor: colors.textPrimary,
            headerStyle: { backgroundColor: colors.background },
            headerShadowVisible: false,
          }}
        />
        <Stack.Screen
          name="memory/[id]"
          options={{
            headerShown: true,
            title: 'Context Inspector',
            headerTintColor: colors.textPrimary,
            headerStyle: { backgroundColor: colors.background },
            headerShadowVisible: false,
          }}
        />
        <Stack.Screen
          name="onboarding"
          options={{
            headerShown: false,
            presentation: 'modal',
          }}
        />
      </Stack>
    </SafeAreaProvider>
  );
}
