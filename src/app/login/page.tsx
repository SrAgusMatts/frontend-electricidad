"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Volvemos a usar router
import { HiUser, HiLockClosed } from "react-icons/hi";
import { loginUsuario } from "@/services/api";
import Toast from "@/components/Toast";
import { useAuth } from "@/context/AuthContext"; // 👇 Importamos el hook

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { login } = useAuth(); // 👇 Usamos la función del contexto

  const [toast, setToast] = useState({ show: false, message: "", type: "success" as "success" | "error" });

  const mostrarNotificacion = (message: string, type: "success" | "error") => {
    setToast({ show: true, message, type });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const usuarioApi = await loginUsuario({ email, password });

      mostrarNotificacion(`¡Bienvenido, ${usuarioApi.nombre}!`, "success");

      // 👇 ACÁ ESTÁ LA MAGIA:
      // En vez de guardar a mano en localStorage, usamos la función login del contexto.
      // Esto actualiza el estado global y el Navbar se entera al instante.
      login(usuarioApi);

      setTimeout(() => {
        router.push("/"); // 👇 Navegación suave (sin flash)
      }, 1500);

    } catch (error) {
      mostrarNotificacion("Credenciales incorrectas. Intentá de nuevo.", "error");
    }
  };

  // ... (El resto del return sigue igual que antes)
  return (
    <div className="login-bg">
      <Toast
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, show: false })}
      />
      {/* ... resto del JSX ... */}
      <div className="glass-card">
        <div className="glass-icon-wrapper">
          <div className="glass-icon-circle">
            <HiUser className="text-slate-900 text-3xl" />
          </div>
        </div>
        <h2 className="glass-title">Sign In</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="glass-input-group">
            <HiUser className="text-gray-400 text-xl" />
            <input type="email" placeholder="Correo Electrónico" className="glass-input-field" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="glass-input-group">
            <HiLockClosed className="text-gray-400 text-xl" />
            <input type="password" placeholder="Contraseña" className="glass-input-field" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="btn-gradient">INGRESAR</button>
          <div className="flex justify-between items-center glass-text-small">
            <label className="flex items-center cursor-pointer"><input type="checkbox" className="mr-2 accent-yellow-500 h-4 w-4" /> Recordarme</label>
            <a href="#" className="glass-link">¿Olvidaste clave?</a>
          </div>
        </form>
        <div className="mt-8 text-center glass-text-small">
          <div className="border-t border-slate-700 pt-4">
            ¿No tenés cuenta? <Link href="/register" className="glass-link font-bold ml-1">REGISTRATE AQUÍ</Link>
          </div>
        </div>

      </div>
    </div>
  );
}