import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { api, AuthResponse } from "@/lib/api";

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  verified: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  loginWithGoogle: (token: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from localStorage
  useEffect(() => {
    const savedToken = localStorage.getItem("auth_token");
    if (savedToken) {
      setToken(savedToken);
      // Validate token and get user info
      api.auth.me()
        .then(({ user }) => {
          setUser(user);
        })
        .catch(() => {
          // Token invalid, clear it
          localStorage.removeItem("auth_token");
          setToken(null);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, []);

  const loginWithGoogle = async (googleToken: string) => {
    try {
      // This will be implemented with Google auth endpoint
      const response = await api.auth.googleLogin(googleToken);
      const { user: newUser, token: newToken } = response;
      
      setUser(newUser);
      setToken(newToken);
      localStorage.setItem("auth_token", newToken);
    } catch (error) {
      console.error("Google login failed:", error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("auth_token");
  };

  const refreshUser = async () => {
    if (!token) return;
    
    try {
      const { user: refreshedUser } = await api.auth.me();
      setUser(refreshedUser);
    } catch (error) {
      console.error("Failed to refresh user:", error);
      logout();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        loginWithGoogle,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
