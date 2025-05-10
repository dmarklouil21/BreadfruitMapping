import { Slot, SplashScreen, Redirect } from 'expo-router';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { PaperProvider } from 'react-native-paper';
import { useEffect } from 'react';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  // Add splash screen timeout
  useEffect(() => {
    setTimeout(() => SplashScreen.hideAsync(), 1000);
  }, []);
  return (
    <PaperProvider>
      <AuthProvider>
        <RoutingController />
      </AuthProvider>
    </PaperProvider>
  );
}

function RoutingController() {
  const { user, initialized } = useAuth();
  
  useEffect(() => {
    if (initialized) {
      SplashScreen.hideAsync();
    }
  }, [initialized]);

  if (!initialized) return null;

  return user ? (
    user.role === 'admin' ? (
      <Redirect href="/(admin)" />
    ) : (
      <Redirect href="/(main)" />
    )
  ) : (
    <Redirect href="/(auth)" />
  );
}