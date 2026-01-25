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

          <div className="flex-shrink-0">
            <Link href="/" className="nav-logo">
              ⚡ ELECTRICIDAD MATTOS
            </Link>
          </div>

          <div className="nav-menu-desktop">
            <div className="nav-items-wrapper">

              <div className="flex items-center space-x-4">
                <Link href="/" className="nav-link">
                  Inicio
                </Link>
                <Link href="/productos" className="nav-link">
                  Catálogo
                </Link>
              </div>

              {usuario ? (
                <div className="flex items-center">

                  <div className="nav-divider"></div>

                  <div className="nav-user-tools">
                    {usuario.rol === "Admin" && (
                      <Link href="/admin/panel" className="nav-btn-admin ml-0 mr-4">
                        <HiViewGrid className="text-lg" />
                        Panel Admin
                      </Link>
                    )}

                    <div className="nav-user-badge ml-0">
                      <HiUserCircle className="text-xl" />
                      <span>{usuario.nombre}</span>
                    </div>

                    <button onClick={cerrarSesion} className="nav-btn-logout" title="Cerrar Sesión">
                      <HiLogout className="text-lg" />
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="nav-divider"></div>
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