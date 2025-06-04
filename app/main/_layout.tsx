// app/(main)/_layout.tsx
import { Redirect, Stack } from 'expo-router';
import { useAuth } from '@/context/AuthContext'; 
import TabsLayout from './(tabs)/_layout'; 

export default function MainLayout() {
  const isAuthenticated = true;
  /* const { user, initialized } = useAuth();

  if (!initialized) return null; // Or <LoadingScreen />

  // Redirect to auth if not logged in
  if (!user) return <Redirect href="../(auth)/login" />;

  // Redirect to admin if needed (optional)
  if (user.role === 'admin') return <Redirect href="../(admin)/manage-users" />; */

  // Use your existing tabs layout
  if (!isAuthenticated) {
    return <Redirect href='/login'></Redirect>
  }

  return (
    <>
      <Stack>
        <Stack.Screen name='(tabs)' options={{headerShown: false}}></Stack.Screen>
        <Stack.Screen name='tree' options={{headerShown: false}}></Stack.Screen>
        <Stack.Screen name='search' options={{headerShown: false}}></Stack.Screen>
        <Stack.Screen name='camera' options={{headerShown: false, presentation: 'modal'}}></Stack.Screen>
      </Stack>
    </>
  );
}