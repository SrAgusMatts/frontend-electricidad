"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext"; 

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { usuario } = useAuth(); 
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
        const storedUser = localStorage.getItem("usuario");
        const usuarioLocal = storedUser ? JSON.parse(storedUser) : null;
        
        const usuarioActual = usuario || usuarioLocal;

        if (!usuarioActual) {
            router.replace("/login");
            return;
        }

        if (usuarioActual.rol !== "Admin") {
            router.replace("/");
            return;
        }

        setAuthorized(true);
    };

    checkAuth();
  }, [usuario, router]);

  if (!authorized) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50">
        <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 mb-2">Electricidad Mattos</div>
            <p className="text-gray-500 animate-pulse">Verificando permisos de administrador...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-panel-wrapper">
        {children}
    </div>
  );
}