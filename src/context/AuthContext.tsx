import React, { createContext, useContext, useState } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'author' | 'reader' | 'publisher';
  penNameSlug?: string;
  imprints?: string[];
}

interface AuthContextType {
  user: User | null;
  login: (role?: 'author' | 'reader') => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'buana_studio_auth_user_v1';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem(AUTH_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return {
      id: 'auth-ahmad-syabani',
      name: 'Dr. Ahmad Syabani',
      email: 'ahmad.syabani@buana.studio',
      role: 'author',
      penNameSlug: 'dr-ahmad-syabani',
      imprints: ['syabab', 'hifzun'],
    };
  });

  const login = (role: 'author' | 'reader' = 'author') => {
    const newUser: User =
      role === 'author'
        ? {
            id: 'auth-ahmad-syabani',
            name: 'Dr. Ahmad Syabani',
            email: 'ahmad.syabani@buana.studio',
            role: 'author',
            penNameSlug: 'dr-ahmad-syabani',
            imprints: ['syabab', 'hifzun'],
          }
        : {
            id: 'auth-reader-1',
            name: 'Reader Enthusiast',
            email: 'reader@example.com',
            role: 'reader',
          };

    setUser(newUser);
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newUser));
    } catch {
      // ignore
    }
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } catch {
      // ignore
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};
