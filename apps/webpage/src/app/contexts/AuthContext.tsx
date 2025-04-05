import React, { createContext, useContext, useState } from "react";
import { useNavigate } from 'react-router-dom';

interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  active: boolean;
  role: string;
}

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  hasRole: (role: string) => boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      localStorage.setItem('token', data.access_token);
      storeUserDetails(data.access_token!);
      navigate('/home');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const logout = () => {
    setAccessToken(null);
    setUser(null);
    localStorage.removeItem('token');
  };

  const hasRole = (role: string) => user?.role === role;

  const storeUserDetails = (token: string) => {
    const decodedToken = JSON.parse(atob(token.split('.')[1]));
    setUser({
      id: decodedToken.sub,
      email: decodedToken.email,
      firstName: decodedToken.firstName,
      lastName: decodedToken.lastName,
      active: decodedToken.active,
      role: decodedToken.role,
    });
    setAccessToken(token);
  };

  return (
    <AuthContext.Provider value={{ user, accessToken, login, logout, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthContextProvider");
  }
  return context;
};
