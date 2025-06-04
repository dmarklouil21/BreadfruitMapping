import { useEffect, useState } from 'react';
import { User } from '@/types'; 
import { mockUsers } from '@/data/mockUsers'; // Direct file reference

export const useUserData = () => {
  const [users, setUser] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        setUser(mockUsers);
      } catch (err) {
        setError('Failed to load tree data');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);

  return { users, isLoading, error };
};