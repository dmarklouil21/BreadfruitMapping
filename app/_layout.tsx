// app/_layout.tsx
import { SplashScreen, Redirect, Slot, Stack } from 'expo-router';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { PaperProvider } from 'react-native-paper';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  // Add splash screen timeout
   useEffect(() => {
    setTimeout(() => SplashScreen.hideAsync(), 1000);
    // SplashScreen.hideAsync(); // Direct call without delay
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PaperProvider>
        <AuthProvider>
          <Slot />
        {/* <RoutingController/> */}
        </AuthProvider>
      </PaperProvider>
    </GestureHandlerRootView>
  );
}

/* function RoutingController() {
  const { user, initialized } = useAuth();
  
  useEffect(() => {
    if (initialized) {
      SplashScreen.hideAsync();
    }
  }, [initialized]);

  if (!initialized) return null;

  return user ? (
    user.role === 'admin' ? (
      <Redirect href="/admin/(tabs)" />
    ) : (
      <Redirect href="/main/(tabs)" />
    )
  ) : (
    <Redirect href="/login" />
  );
} */