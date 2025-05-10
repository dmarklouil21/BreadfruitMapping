// hooks/useAdminGuard.ts
import { useAuth } from '@/context/AuthContext';
import { router } from 'expo-router';
import { useEffect } from 'react';

export const useAdminGuard = () => {
  const { user } = useAuth();

  useEffect(() => {
    if (user?.role !== 'admin') {
      router.replace('/unauthorized');
    }
  }, [user?.role]);
};