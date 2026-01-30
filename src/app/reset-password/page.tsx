"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { HiLockClosed, HiCheckCircle, HiXCircle } from "react-icons/hi";
import { restablecerPassword } from "@/services/api";

function ResetPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const token = searchParams.get("token");
    const email = searchParams.get("email");

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
    const [mensaje, setMensaje] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validaciones locales (se mantienen igual)
        if (password !== confirmPassword) {
            setMensaje("Las contraseñas no coinciden.");
            setStatus("error");
            return;
        }
        if (password.length < 6) {
            setMensaje("La contraseña debe tener al menos 6 caracteres.");
            setStatus("error");
            return;
        }

        setLoading(true);
        setMensaje("");

        try {
            // 👇 AQUÍ ESTÁ EL CAMBIO: Llamada limpia al servicio
            // Ya no hay fetch, ni headers, ni JSON.stringify aquí.
            const respuesta = await restablecerPassword(email!, token!, password);

            if (respuesta.ok) {
                setStatus("success");
                setTimeout(() => router.push("/login"), 3000);
            } else {
                setStatus("error");
                setMensaje(respuesta.message || "Error al restablecer la contraseña.");
            }

        } catch (error) {
            // Este catch atrapa si el servidor está caído (Network Error)
            setStatus("error");
            setMensaje("Error de conexión con el servidor.");
        } finally {
            setLoading(false);
        }
    };

    if (!token || !email) {
        return (
            <div className="text-center p-6">
                <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <HiXCircle className="text-3xl" />
                </div>
                <h2 className="text-xl font-bold text-red-600 mb-2">Enlace inválido</h2>
                <Link href="/recuperar" className="text-blue-600 font-bold hover:underline">Volver a intentar</Link>
            </div>
        );
    }

    if (status === "success") {
        return (
            <div className="success-box">
                <div className="success-icon-wrapper animate-bounce">
                    <HiCheckCircle className="text-3xl" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">¡Listo!</h2>
                <p className="text-gray-500 mb-6">Contraseña actualizada correctamente.</p>
                <div className="text-sm text-blue-600 font-medium animate-pulse">Redirigiendo al login...</div>
            </div>
        );
    }

    return (
        <>
            <h1 className="auth-title">Nueva Contraseña</h1>
            <p className="auth-description">Crea una nueva clave para tu cuenta.</p>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="form-group">
                    <label className="form-label">Nueva Contraseña</label>
                    <div className="input-wrapper">
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="form-input"
                            placeholder="••••••"
                        />
                        <HiLockClosed className="input-icon" />
                    </div>
                </div>

                <div className="form-group">
                    <label className="form-label">Confirmar Contraseña</label>
                    <div className="input-wrapper">
                        <input
                            type="password"
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="form-input"
                            placeholder="••••••"
                        />
                        <HiLockClosed className="input-icon" />
                    </div>
                </div>

                {status === "error" && <div className="msg-error">{mensaje}</div>}

                <button type="submit" disabled={loading} className="btn-primary">
                    {loading ? "Actualizando..." : "Cambiar Contraseña"}
                </button>
            </form>
        </>
    );
}

export default function ResetPasswordPage() {
    return (
        <div className="auth-page-wrapper">
            <Navbar />
            <div className="auth-content">
                <div className="auth-card">
                    <Suspense fallback={<div>Cargando...</div>}>
                        <ResetPasswordForm />
                    </Suspense>
                </div>
            </div>
        </div>
    );
}