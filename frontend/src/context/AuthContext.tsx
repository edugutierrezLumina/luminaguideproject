/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import api from '../services/api';
import { AxiosError } from 'axios';

interface User {
  id: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

interface LoginResponse {
  token: string;
  user: User;
}

interface ErrorResponse {
  message: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Limpiar localStorage corrupto al cargar
if (typeof window !== 'undefined') {
  const userStr = localStorage.getItem('user');
  const tokenStr = localStorage.getItem('token');
  
  if (userStr === 'undefined' || userStr === 'null') {
    localStorage.removeItem('user');
  }
  
  if (tokenStr === 'undefined' || tokenStr === 'null') {
    localStorage.removeItem('token');
  }
}

// Función helper para obtener usuario del localStorage de forma segura
const getCurrentUser = (): User | null => {
  const userStr = localStorage.getItem('user');
  
  if (!userStr || userStr === 'undefined' || userStr === 'null') {
    return null;
  }
  
  try {
    const parsed: User = JSON.parse(userStr);
    return parsed;
  } catch (error) {
    console.error('Error parsing user from localStorage:', error);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    return null;
  }
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(getCurrentUser);

  useEffect(() => {
    // Verificar si hay un token guardado al montar el componente
    const token = localStorage.getItem('token');
    const savedUser = getCurrentUser();
    
    if (token && savedUser) {
      console.log('✅ User restored from localStorage:', savedUser.email);
      setUser(savedUser);
    } else {
      // Si no hay token o user válidos, limpiar
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      console.log('🔐 Attempting login for:', email);
      
      const response = await api.post<LoginResponse>('/auth/login', { email, password });
      const { token, user: userData } = response.data;
      
      console.log('✅ Login successful:', userData.email, 'Role:', userData.role);
      
      // Guardar token y usuario
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      
      setUser(userData);
    } catch (error) {
      console.error('❌ Error en login:', error);
      
      // Type guard para AxiosError
      if (error instanceof AxiosError) {
        const errorMessage = (error.response?.data as ErrorResponse)?.message || 'Error al iniciar sesión';
        console.error('Error details:', error.response?.data);
        throw new Error(errorMessage);
      }
      
      // Si es otro tipo de error
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      
      // Fallback genérico
      throw new Error('Error al iniciar sesión');
    }
  };

  const logout = () => {
    console.log('🚪 Logging out...');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};