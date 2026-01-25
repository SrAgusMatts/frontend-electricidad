"use client";

import { useState } from "react";
import Link from "next/link";
// Agregamos HiMail para el campo de correo
import { HiUser, HiLockClosed, HiIdentification, HiMail } from "react-icons/hi";
import { registrarUsuario } from "@/services/api";
import { useRouter } from "next/navigation";
import Toast from "@/components/Toast";

export default function RegisterPage() {
    // Estado para la notificación (Toast)
    const [toast, setToast] = useState({ show: false, message: "", type: "success" as "success" | "error" });
    
    const mostrarNotificacion = (message: string, type: "success" | "error") => {
        setToast({ show: true, message, type });
    };

    // Estados del formulario
    const [nombre, setNombre] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            // Llamamos al backend
            await registrarUsuario({
                nombre,
                email,
                password
            });

            // Si sale bien:
            mostrarNotificacion(`¡Bienvenido, ${nombre}!`, "success");
            
            // Redirigimos después de 1.5 segundos para que lean el mensaje
            setTimeout(() => {
                router.push("/login");
            }, 1500);

        } catch (error: any) {
            // Si sale mal (ej: email repetido)
            mostrarNotificacion("Error: " + (error.message || "Intentá de nuevo."), "error");
        }
    };

    return (
        <div className="login-bg">
            <Toast
                show={toast.show}
                message={toast.message}
                type={toast.type}
                onClose={() => setToast({ ...toast, show: false })}
            />
            
            <div className="glass-card">

                {/* Icono superior */}
                <div className="glass-icon-wrapper">
                    <div className="glass-icon-circle">
                        <HiIdentification className="text-slate-900 text-3xl" />
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

                    {/* Input: Email (Con ícono de Mail) */}
                    <div className="glass-input-group">
                        <HiMail className="text-gray-400 text-xl" />
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