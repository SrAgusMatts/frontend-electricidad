"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { HiUserCircle, HiLogout, HiViewGrid } from "react-icons/hi";

export default function Navbar() {
  const router = useRouter();
  const [usuario, setUsuario] = useState<any>(null);

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem("usuarioMattos");
    if (usuarioGuardado) {
      setUsuario(JSON.parse(usuarioGuardado));
    }
  }, []);

  const cerrarSesion = () => {
    localStorage.removeItem("usuarioMattos");
    setUsuario(null);
    router.push("/login");
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-wrapper">

          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="nav-logo">
              ⚡ ELECTRICIDAD MATTOS
            </Link>
          </div>

          {/* Menú Escritorio */}
          <div className="nav-menu-desktop">
            <div className="nav-items-wrapper">

              {/* SECCIÓN 1: Navegación General */}
              <div className="flex items-center space-x-4">
                <Link href="/" className="nav-link">
                  Inicio
                </Link>
                <Link href="/productos" className="nav-link">
                  Catálogo
                </Link>
              </div>

              {/* SECCIÓN 2: Zona de Usuario (Separada por la línea) */}
              {usuario ? (
                <div className="flex items-center">

                  {/* 👇 ACÁ ESTÁ EL TRUCO: La línea divisoria */}
                  <div className="nav-divider"></div>

                  <div className="nav-user-tools">
                    {/* Botón Admin */}
                    {usuario.rol === "Admin" && (
                      <Link href="/admin/panel" className="nav-btn-admin ml-0 mr-4">
                        <HiViewGrid className="text-lg" />
                        Panel Admin
                      </Link>
                    )}

                    {/* Badge Usuario */}
                    <div className="nav-user-badge ml-0">
                      <HiUserCircle className="text-xl" />
                      <span>{usuario.nombre}</span>
                    </div>

                    {/* Salir */}
                    <button onClick={cerrarSesion} className="nav-btn-logout" title="Cerrar Sesión">
                      <HiLogout className="text-lg" />
                    </button>
                  </div>
                </div>
              ) : (
                /* Visitante */
                <>
                  <div className="nav-divider"></div> {/* También separamos el botón Ingresar */}
                  <Link href="/login" className="nav-btn-login">
                    Ingresar
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}