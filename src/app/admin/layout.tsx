"use client"; // 👈 Obligatorio porque usamos hooks y localStorage

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext"; 

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { usuario } = useAuth(); // Traemos al usuario del contexto
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    // 1. Intentamos leer el usuario (del Contexto o del LocalStorage de respaldo)
    const checkAuth = () => {
        // A veces el contexto tarda 1ms en cargar, por seguridad miramos localStorage también
        const storedUser = localStorage.getItem("usuario");
        const usuarioLocal = storedUser ? JSON.parse(storedUser) : null;
        
        // Priorizamos el contexto, si no hay, usamos el local
        const usuarioActual = usuario || usuarioLocal;

        // CASO A: No hay nadie logueado
        if (!usuarioActual) {
            router.replace("/login");
            return;
        }

        // CASO B: Está logueado pero NO es Admin (es Cliente)
        // Asegurate que en tu BD el rol esté escrito así: "Admin" (o "Administrador")
        if (usuarioActual.rol !== "Admin") {
            router.replace("/"); // Lo mandamos al inicio
            return;
        }

        setAuthorized(true);
    };

    checkAuth();
  }, [usuario, router]);

  // Mientras verificamos, mostramos una pantalla de carga para que no vea nada "prohibido"
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

  // Si pasó la seguridad, renderizamos el contenido (los pedidos, productos, etc.)
  return (
    <div className="admin-panel-wrapper">
        {/* Acá podrías agregar un Navbar o Sidebar exclusivo para Admin si quisieras */}
        {children}
    </div>
  );
}