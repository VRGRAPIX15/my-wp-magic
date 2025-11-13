import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, User } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (userId: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const storedToken = localStorage.getItem('auth_token');
    if (storedToken) {
      api.me(storedToken).then((response) => {
        if (response.ok && response.user) {
          setUser(response.user);
          setToken(storedToken);
        } else {
          localStorage.removeItem('auth_token');
        }
        setIsLoading(false);
      });
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (userId: string, password: string) => {
    try {
      const response = await api.login(userId, password);
      if (response.ok && response.token && response.user) {
        setUser(response.user);
        setToken(response.token);
        localStorage.setItem('auth_token', response.token);
        toast({ title: "Login successful", description: `Welcome ${response.user.displayName}!` });
      } else {
        throw new Error(response.error || 'Login failed');
      }
    } catch (error) {
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : 'Invalid credentials',
        variant: "destructive",
      });
      throw error;
    }
  };

  const logout = async () => {
    if (token) {
      await api.logout(token);
    }
    setUser(null);
    setToken(null);
    localStorage.removeItem('auth_token');
    toast({ title: "Logged out successfully" });
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
