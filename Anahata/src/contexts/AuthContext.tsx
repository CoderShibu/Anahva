import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI } from '@/lib/api';

interface User {
  name: string;
  country?: string;
}

interface AuthContextType {
  user: User | null;
  login: (name: string, password: string) => Promise<boolean>;
  signup: (name: string, password: string, confirmPassword: string, country: string) => { success: boolean; error?: string };
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const login = async (name: string, password: string): Promise<boolean> => {
    try {
      // Try backend login first
      const response = await authAPI.demoLogin(name, password);
      if (response.success && response.token) {
        localStorage.setItem('authToken', response.token);
        setUser({ name: name });
        return true;
      }
    } catch (error) {
      console.error('Backend login failed:', error);
    }

    // Fallback to local storage for demo
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const foundUser = users.find((u: any) => u.name === name && u.password === password);
    
    if (foundUser) {
      setUser({ name: foundUser.name, country: foundUser.country });
      return true;
    }
    
    if (name === 'Shibasish' && password === 'Shibasish') {
      setUser({ name });
      return true;
    }
    return false;
  };

  const signup = (name: string, password: string, confirmPassword: string, country: string) => {
    if (password !== confirmPassword) {
      return { success: false, error: 'Passwords do not match' };
    }
    
    if (password.length < 4) {
      return { success: false, error: 'Password must be at least 4 characters' };
    }
    
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.some((u: any) => u.name === name)) {
      return { success: false, error: 'Username already exists' };
    }
    
    users.push({ name, password, country });
    localStorage.setItem('users', JSON.stringify(users));
    setUser({ name, country });
    return { success: true };
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
    setUser(null);
    localStorage.removeItem('authToken');
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
