import { useAuth } from '@/context/AuthContext';
import { Stack, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';

export default function MainLayout() {
  const { user, initialized } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!initialized) return;

    if (user?.role !== 'researcher') {
      router.replace('/login');
    }
  }, [initialized, user]);

  if (!initialized) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#2ecc71" />
      </View>
    );
  }

  if (user?.role !== 'researcher') {
    return null;
  }

  return (
    <Stack>
      <Stack.Screen name='(tabs)' options={{headerShown: false}}></Stack.Screen>
      <Stack.Screen name='tree' options={{headerShown: false}}></Stack.Screen>
      <Stack.Screen name='user' options={{headerShown: false}}></Stack.Screen>
      <Stack.Screen name='search' options={{headerShown: false}}></Stack.Screen>
      <Stack.Screen name='camera' options={{headerShown: false, presentation: 'modal'}}></Stack.Screen>
    </Stack>
  );
}