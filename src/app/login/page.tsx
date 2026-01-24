"use client";

import { useState } from "react";
import Link from "next/link";
import { HiUser, HiLockClosed } from "react-icons/hi";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login con:", email, password);
    alert("¡Funcionalidad de login próximamente! 🚀");
  };

  return (
    <div className="login-bg">
      
      {/* Tarjeta Glassmorphism */}
      <div className="glass-card">
        
        {/* Icono circular superior */}
        <div className="glass-icon-wrapper">
          <div className="glass-icon-circle">
            <HiUser className="text-white text-3xl" />
          </div>
        </div>

        <h2 className="glass-title">Sign In</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Input Usuario */}
          <div className="glass-input-group">
            <HiUser className="text-gray-400 text-xl" />
            <input
              type="email"
              placeholder="Username"
              className="glass-input-field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Input Contraseña */}
          <div className="glass-input-group">
            <HiLockClosed className="text-gray-400 text-xl" />
            <input
              type="password"
              placeholder="Password"
              className="glass-input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Botón Login */}
          <button type="submit" className="btn-gradient">
            Login
          </button>

          {/* Opciones extra */}
          <div className="flex justify-between items-center glass-text-small">
            <label className="flex items-center cursor-pointer">
              <input type="checkbox" className="mr-2 accent-teal-500 h-4 w-4" />
              Remember me
            </label>
            <a href="#" className="glass-link">
              Forgot Password?
            </a>
          </div>
        </form>

        {/* Footer Register */}
        <div className="mt-8 text-center glass-text-small">
          <div className="border-t border-white/30 pt-4">
            Don't have an account?{" "}
            <Link href="/register" className="font-bold hover:underline ml-1">
              REGISTER HERE
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}