import { Tree } from '@/types';
import { collection, doc, getDoc, getDocs, getFirestore, query, where } from "firebase/firestore";
import { useEffect, useState } from 'react';

type FetchType =
  | { mode: 'all' }
  | { mode: 'criteria'; field: string; operator: FirebaseFirestore.WhereFilterOp; value: any }
  | { mode: 'single'; treeID: string };

export const useTreeData = (fetchConfig: FetchType = { mode: 'all' }) => {
  const [trees, setTrees] = useState<Tree[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const db = getFirestore();
    const treesRef = collection(db, 'trees');

    const getTrees = async () => {
      try {
        let treeData: Tree[] = [];

        if (fetchConfig.mode === 'all') {
          const q = query(treesRef, where('status', '==', 'verified'));
          const snapshot = await getDocs(q);
          treeData = snapshot.docs.map(doc => ({ treeID: doc.id, ...doc.data() } as Tree));

          // const snapshot = await getDocs(treesRef);
          // treeData = snapshot.docs.map(doc => ({ treeID: doc.id, ...doc.data() } as Tree));
        }

        else if (fetchConfig.mode === 'criteria') {
          if (fetchConfig.field == 'status') {
            const q = query(treesRef, 
              where(fetchConfig.field, fetchConfig.operator, fetchConfig.value),
            );
            const snapshot = await getDocs(q);
            treeData = snapshot.docs.map(doc => ({ treeID: doc.id, ...doc.data() } as Tree));
          } else {
            const q = query(treesRef, 
              where(fetchConfig.field, fetchConfig.operator, fetchConfig.value),
              where('status', '==', 'verified')
            );
            const snapshot = await getDocs(q);
            treeData = snapshot.docs.map(doc => ({ treeID: doc.id, ...doc.data() } as Tree));
          }
        }

        else if (fetchConfig.mode === 'single') {
          const docRef = doc(db, 'trees', fetchConfig.treeID);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            treeData = [{ treeID: docSnap.id, ...docSnap.data() } as Tree];
          } else {
            throw new Error("Tree not found");
          }
        }

        setTrees(treeData); 
        setError(null);
        
        } catch (error: any) {
          console.error('Error fetching trees:', error);
          setError(error.message);
        } finally {
          setIsLoading(false);
        }
      };

    getTrees();
  }, []);

  return { trees, isLoading, error };
};