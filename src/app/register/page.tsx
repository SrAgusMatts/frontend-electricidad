"use client";

import { useState } from "react";
import Link from "next/link";
// Importamos un icono extra para el nombre
import { HiUser, HiLockClosed, HiIdentification } from "react-icons/hi";

export default function RegisterPage() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Registrando a:", nombre, email, password);
    alert("¡Registro próximamente! (Falta conectar Backend) 🔌");
  };

  return (
    <div className="login-bg">
      <div className="glass-card">
        
        {/* Icono superior */}
        <div className="glass-icon-wrapper">
          <div className="glass-icon-circle">
            {/* Usamos un ícono de "ID" para variar un poco */}
            <HiIdentification className="text-white text-3xl" />
          </div>
        </div>

        <h2 className="glass-title">Crear Cuenta</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Input: Nombre Completo */}
          <div className="glass-input-group">
            <HiUser className="text-gray-400 text-xl" />
            <input
              type="text"
              placeholder="Nombre Completo"
              className="glass-input-field"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </div>

          {/* Input: Email */}
          <div className="glass-input-group">
            <HiUser className="text-gray-400 text-xl" />
            <input
              type="email"
              placeholder="Correo Electrónico"
              className="glass-input-field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Input: Contraseña */}
          <div className="glass-input-group">
            <HiLockClosed className="text-gray-400 text-xl" />
            <input
              type="password"
              placeholder="Contraseña"
              className="glass-input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn-gradient mt-4">
            Registrarse
          </button>

        </form>

        {/* Footer: Volver al login */}
        <div className="mt-8 text-center glass-text-small">
          <div className="border-t border-white/10 pt-4">
            ¿Ya tenés cuenta?{" "}
            <Link href="/login" className="glass-link font-bold ml-1">
              INGRESAR
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}