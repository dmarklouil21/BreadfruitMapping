import { useEffect, useState } from 'react';
import { Tree } from '../types'; 
import { mockTrees } from '../data/mockTrees'; // Direct file reference

export const useTreeData = () => {
  const [trees, setTrees] = useState<Tree[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        setTrees(mockTrees);
      } catch (err) {
        setError('Failed to load tree data');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);

  return { trees, isLoading, error };
};