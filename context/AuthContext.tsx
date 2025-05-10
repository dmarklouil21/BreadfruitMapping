import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

type User = {
  username?: string;
  email?: string;
  token?: string;
  role?: 'researcher' | 'admin' | 'viewer';
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
  const [isLoading, setIsLoading] = useState(true);

  const login = (userData: User) => {
    setUser({
      username: userData.username,
      email: userData.email,
      token: userData.token
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
      setIsLoading(false);
    };
    
    initAuth();
  }, []);

  if (isLoading) return null;

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
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