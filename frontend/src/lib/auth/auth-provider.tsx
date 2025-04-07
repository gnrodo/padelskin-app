'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

// Definir la interfaz para el usuario autenticado
interface AuthUser {
  name?: string;
  email?: string;
  picture?: string;
  sub?: string;
}

// Definir la interfaz para el contexto de autenticación
interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  error: string | null;
  login: () => void;
  logout: () => void;
}

// Crear el contexto con un valor predeterminado
const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  error: null,
  login: () => {},
  logout: () => {},
});

// Función para obtener el email del usuario de las cookies
function getUserEmailFromCookies(): string | null {
  if (typeof document === 'undefined') return null;
  
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === 'user_email') {
      return decodeURIComponent(value);
    }
  }
  return null;
}

// Hook personalizado para acceder al contexto de autenticación
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Función para obtener el usuario actual
  const fetchUser = async () => {
    try {
      setIsLoading(true);
      
      // Obtener email de las cookies si existe
      const userEmail = getUserEmailFromCookies();
      
      // Construir URL con parámetros
      let url = '/api/auth/me';
      if (userEmail) {
        url += `?email=${encodeURIComponent(userEmail)}`;
      }
      
      // Verificar si hay un email en los parámetros de la URL (después de autenticación)
      if (typeof window !== 'undefined') {
        const urlParams = new URLSearchParams(window.location.search);
        const emailParam = urlParams.get('email');
        
        if (emailParam) {
          url += `?email=${encodeURIComponent(emailParam)}`;
          
          // Limpiar parámetros de la URL para no exponer información sensible
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      }
      
      // Hacer solicitud a la API
      const res = await fetch(url);
      
      if (res.ok) {
        const userData = await res.json();
        setUser(userData);
      } else {
        // Si no hay usuario autenticado, el endpoint devuelve 401
        setUser(null);
      }
    } catch (err) {
      console.error('Error al obtener la información del usuario:', err);
      setError('No se pudo obtener la información del usuario');
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Cargar el usuario al montar el componente y cuando cambie la URL
  useEffect(() => {
    fetchUser();
    
    // También escuchar cambios en la URL por si volvemos de Auth0
    const handleUrlChange = () => {
      if (window.location.search.includes('auth_success=true')) {
        fetchUser();
      }
    };
    
    window.addEventListener('popstate', handleUrlChange);
    return () => window.removeEventListener('popstate', handleUrlChange);
  }, []);

  // Función para iniciar sesión
  const login = () => {
    window.location.href = '/api/auth/login';
  };

  // Función para cerrar sesión
  const logout = () => {
    window.location.href = '/api/auth/logout';
  };

  // Proporcionar el contexto a los componentes hijos
  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        error,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}