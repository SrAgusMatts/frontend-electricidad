"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { HiUser, HiLockClosed } from "react-icons/hi";
import { loginUsuario } from "@/services/api";
// 1. Importamos el Toast
import Toast from "@/components/Toast";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  // 2. Estado para manejar la notificación
  const [toast, setToast] = useState({ show: false, message: "", type: "success" as "success" | "error" });

  const mostrarNotificacion = (message: string, type: "success" | "error") => {
    setToast({ show: true, message, type });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const usuario = await loginUsuario({ email, password });

      // 3. Usamos el Toast en lugar de alert
      mostrarNotificacion(`¡Bienvenido, ${usuario.nombre}!`, "success");

      localStorage.setItem("usuarioMattos", JSON.stringify(usuario));

      // Esperamos un poquito para que el usuario lea el mensaje antes de cambiar de página
      setTimeout(() => {
        router.push("/");
      }, 1500);

    } catch (error) {
      // 3. Usamos el Toast de error
      mostrarNotificacion("Credenciales incorrectas. Intentá de nuevo.", "error");
    }
  };

  return (
    <div className="login-bg">
      {/* 4. Renderizamos el componente Toast siempre (él sabe cuándo mostrarse) */}
      <Toast
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, show: false })}
      />

      <div className="glass-card">
        {/* ... (Todo el resto del código del login queda IGUAL) ... */}
        {/* Solo copio la parte del formulario para ahorrar espacio, pero vos dejá todo lo visual igual */}

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