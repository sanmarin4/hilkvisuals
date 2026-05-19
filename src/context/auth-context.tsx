import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  fullName: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, fullName?: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    loadStorageData();
  }, []);

  async function loadStorageData() {
    try {
      const authDataSerialized = await AsyncStorage.getItem('@AuthData');
      if (authDataSerialized) {
        const _authData: User = JSON.parse(authDataSerialized);
        setUser(_authData);
      }
    } catch (error) {
      console.error('Failed to load auth data', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function signIn(email: string, fullName: string = 'FIONA LUZADAS') {
    const userData = { email, fullName };
    setUser(userData);
    await AsyncStorage.setItem('@AuthData', JSON.stringify(userData));
  }

  async function signOut() {
    setUser(null);
    await AsyncStorage.removeItem('@AuthData');
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
