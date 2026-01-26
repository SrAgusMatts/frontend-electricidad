"use client";

import Link from "next/link";
import { useState } from "react"; // Ya no necesitamos useEffect para el usuario
import { HiMenu, HiX, HiShoppingCart, HiUserCircle, HiLogout } from "react-icons/hi";
import { useCarrito } from "@/context/CarritoContext";
import { useAuth } from "@/context/AuthContext"; // 👇 Importamos Auth

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const { cantidadTotal } = useCarrito();
  const { usuario, logout } = useAuth(); // 👇 Obtenemos usuario y logout directamente

  // El useEffect manual y localStorage se borran de acá. 
  // Ya lo maneja el Contexto automáticamente.

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-wrapper">

          <div className="nav-brand-wrapper">
            <Link href="/" className="nav-logo">
              ⚡ ELECTRICIDAD MATTOS
            </Link>
          </div>

          <div className="nav-menu-desktop">
            <div className="nav-desktop-list">
              <Link href="/" className="nav-link">Inicio</Link>
              <Link href="/#catalogo" className="nav-link">Catálogo</Link>

              <Link href="/carrito" className="nav-cart-link">
                <HiShoppingCart className="nav-cart-icon" />
                {cantidadTotal > 0 && (
                  <span className="nav-cart-badge">
                    {cantidadTotal}
                  </span>
                )}
              </Link>

              <div className="nav-divider"></div>

              {/* Usamos la variable 'usuario' del contexto */}
              {usuario ? (
                <div className="nav-user-tools">
                  <div className="nav-user-badge">
                    <HiUserCircle className="text-xl" />
                    <span className="text-sm">{usuario.nombre}</span>
                  </div>

                  {usuario.rol === "Admin" && (
                    /* Dejo tu link corregido */
                    <Link href="/admin/panel" className="nav-btn-admin">
                      <span>Panel Admin</span>
                    </Link>
                  )}

                  {/* Usamos la función logout del contexto */}
                  <button onClick={logout} className="nav-btn-logout" title="Cerrar Sesión">
                    <HiLogout className="text-xl" />
                  </button>
                </div>
              ) : (
                <div className="nav-auth-wrapper">
                  <Link href="/login" className="nav-btn-login">
                    INGRESAR
                  </Link>
                  <Link href="/registro" className="nav-link-register">
                    Crear Cuenta
                  </Link>
                </div>
              )}
            </div>
          </div>

          <div className="nav-mobile-wrapper">
            <Link href="/carrito" className="nav-cart-link">
              <HiShoppingCart className="nav-cart-icon" />
              {cantidadTotal > 0 && (
                <span className="nav-cart-badge">
                  {cantidadTotal}
                </span>
              )}
            </Link>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="nav-mobile-toggle"
            >
              {menuOpen ? <HiX className="h-6 w-6" /> : <HiMenu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="nav-mobile-menu">
          <div className="nav-mobile-list">
            <Link href="/" className="nav-mobile-link">
              Inicio
            </Link>
            <Link href="/#catalogo" className="nav-mobile-link">
              Catálogo
            </Link>

            {usuario && usuario.rol === "Admin" && (
              <Link href="/admin/panel" className="nav-mobile-link-admin">
                Panel de Control
              </Link>
            )}

            {usuario ? (
              <button onClick={logout} className="nav-mobile-link-logout">
                Cerrar Sesión ({usuario.nombre})
              </button>
            ) : (
              <Link href="/login" className="nav-mobile-link-highlight">
                Ingresar
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}