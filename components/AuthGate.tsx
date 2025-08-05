import { useAuth } from '@/context/AuthContext';
import { Slot, useRouter, useSegments } from 'expo-router';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';

export function AuthGate() {
  const { isAuthenticated, initialized, user } = useAuth();
  const router = useRouter();
  const segments = useSegments();
  const [navigated, setNavigated] = useState(false);

  useEffect(() => {
    if (!initialized) return;

    const inAuthGroup = ['login', 'register'].includes(segments[0] || '');

    if (isAuthenticated && inAuthGroup) {
      if (user?.role === 'admin') {
        router.replace('/admin/(tabs)');
      } else if (user?.role === 'researcher') {
        router.replace('/researcher/(tabs)');
      } else if (user?.role === 'viewer') {
        router.replace('/viewer/(tabs)/map');
      } 
    } else if (!isAuthenticated && !inAuthGroup) {
      router.replace('/login');
    } 
   setNavigated(true);

  }, [initialized, isAuthenticated, segments]);

  if (!navigated) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={'#2ecc71'}/>
      </View>
    );
  }

  return <Slot />;
}
