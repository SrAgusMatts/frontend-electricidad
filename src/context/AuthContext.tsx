"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";

// Definimos la forma del usuario (según tu backend)
interface Usuario {
  nombre: string;
  email: string;
  rol: string;
}

interface AuthContextType {
  usuario: Usuario | null;
  login: (userData: Usuario) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("usuario_mattos");
    if (storedUser) {
      try {
        setUsuario(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error al leer usuario", error);
        localStorage.removeItem("usuario_mattos");
      }
    }
    setLoading(false);
  }, []);

  const login = (userData: Usuario) => {
    setUsuario(userData);
    localStorage.setItem("usuario_mattos", JSON.stringify(userData));
  };

  const logout = () => {
    setUsuario(null);
    localStorage.removeItem("usuario_mattos");
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ usuario, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return context;
}