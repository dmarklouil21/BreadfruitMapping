import * as SecureStore from 'expo-secure-store';
import {
  User as FirebaseUser,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';

import { auth } from '@/firebaseConfig';
import { AuthContextType, User } from '@/types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [initialized, setInitialized] = useState(false);
  const db = getFirestore();

  const isAuthenticated = user?.status === 'verified';

  const fetchUserData = useCallback(
    async (firebaseUser: FirebaseUser): Promise<User | null> => {
      try {
        const docRef = doc(db, 'users', firebaseUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          const userData: User = {
            uid: data.uid,
            name: data.name,
            email: data.email,
            role: data.role,
            status: data.status,
            image: data.image,
            joined: data.joined,
          };
          return userData;
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      }
      return null;
    },
    [db]
  );

  const login = useCallback(
    async (email: string, password: string): Promise<User | null> => {
      try {
        const credential = await signInWithEmailAndPassword(auth, email, password);
        const firebaseUser = credential.user;
        const userData = await fetchUserData(firebaseUser);

        if (userData) {
          setUser(userData);
          await SecureStore.setItemAsync('user', JSON.stringify(userData));
          return userData;
        }
        return null;
      } catch (err) {
        console.error('Login error:', err);
        throw err;
      }
    },
    [fetchUserData]
  );

  const logout = useCallback(async () => {
    try {
      await signOut(auth);
      await SecureStore.deleteItemAsync('user');
      setUser(null);
    } catch (err) {
      console.error('Logout failed:', err);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userData = await fetchUserData(firebaseUser);
        if (userData) {
          setUser(userData);
          await SecureStore.setItemAsync('user', JSON.stringify(userData));
        }
      } else {
        setUser(null);
        await SecureStore.deleteItemAsync('user');
      }
      setInitialized(true);
    });

    return unsubscribe;
  }, [fetchUserData]);

  const value = useMemo(
    () => ({
      user,
      login,
      logout,
      isAuthenticated,
      initialized,
    }),
    [user, login, logout, initialized]
  );

  if (!initialized) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color='#2ecc71' />
      </View>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
