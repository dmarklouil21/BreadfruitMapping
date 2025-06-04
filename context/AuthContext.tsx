// components/AuthContext
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';

type User = {
  username?: string;
  email?: string;
  token?: string;
  role?: 'researcher' | 'admin' | 'viewer';
  image?: string;
  joined?: string
};

type AuthContextType = {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  initialized: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [initialized, setInitialized] = useState(false); 

  const login = (userData: User) => {
    setUser({
      username: userData.username,
      email: userData.email,
      token: userData.token,
      role: userData.role, 
      image: userData.image,
    });
  };

  const logout = () => {
    // Implement your actual logout logic here
    setUser(null);
  };

  // Add auth initialization check
  useEffect(() => {
    const initAuth = async () => {
      // Add your actual auth initialization logic here
      // const storedUser = await SecureStore.getItemAsync('user');

      /* if (storedUser) {
        setUser(JSON.parse(storedUser));
      } */

      setInitialized(true);
    };
    
    initAuth();
  }, []);

  if (!initialized) return null;

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      initialized
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};