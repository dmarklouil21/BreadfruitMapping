// app/(admin)/_layout.tsx
import { Stack } from 'expo-router';
import { useAdminGuard } from '@/hooks/useAdminGuard';

export default function AdminLayout() {
  useAdminGuard(); // Blocks non-admin users
  
  return (
    <Stack>
      <Stack.Screen 
        name="manage-users" 
        options={{ title: 'User Management' }}
      />
      <Stack.Screen
        name="user-list"
        options={{ title: 'Registered Users' }}
      />
    </Stack>
  );
}