// app/admin/_layout.tsx
import { Redirect, Stack } from 'expo-router';
import { useAuth } from '@/context/AuthContext'; 
import TabsLayout from './(tabs)/_layout';

export default function AdminLayout() {
  return (
    <>
      <Stack>
        <Stack.Screen name='(tabs)' options={{headerShown: false}}></Stack.Screen>
        <Stack.Screen name='user' options={{headerShown: false}}></Stack.Screen>
        <Stack.Screen name='search' options={{headerShown: false}}></Stack.Screen>
      </Stack>
    </>
  );
}