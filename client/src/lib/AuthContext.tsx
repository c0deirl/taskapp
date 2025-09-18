import { createContext, useContext, useEffect, useState } from 'react';
import { auth, type User, type LoginCredentials } from './authApi';
import { useToast } from '@/components/ui/use-toast';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  createDefaultUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    auth.getCurrentUser()
      .then(setUser)
      .finally(() => setIsLoading(false));
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      const user = await auth.login(credentials);
      setUser(user);
      toast({
        title: "Login successful",
        description: `Welcome back, ${user.username}!`
      });
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Invalid username or password",
        variant: "destructive"
      });
      throw error;
    }
  };

  const logout = async () => {
    await auth.logout();
    setUser(null);
    toast({
      title: "Logged out",
      description: "You have been logged out successfully"
    });
  };

  const createDefaultUser = async () => {
    try {
      await login({ 
        username: "admin", 
        password: "password123" 
      });
      toast({
        title: "Default user created",
        description: "Username: admin, Password: password123"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create default user",
        variant: "destructive"
      });
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, createDefaultUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}