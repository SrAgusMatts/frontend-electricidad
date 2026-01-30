"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { HiMail, HiArrowLeft } from "react-icons/hi";
import { solicitarRecuperacion } from "@/services/api";

export default function RecuperarPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
        debugger;
      const exito = await solicitarRecuperacion(email);

      if (exito) {
        setEnviado(true);
      } else {
        setError("Hubo un problema al conectar con el servidor.");
      }
    } catch (err) {
      setError("No se pudo conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-wrapper">
      <Navbar />

      <div className="auth-content">
        <div className="auth-card">
          
          <Link href="/login" className="auth-back-link">
            <HiArrowLeft className="mr-1 text-lg" /> Volver al Login
          </Link>

          <h1 className="auth-title">Recuperar Contraseña</h1>

          {!enviado ? (
            <>
              <p className="auth-description">
                Ingresá tu correo y te enviaremos las instrucciones.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="form-group">
                  <label htmlFor="email" className="form-label">Correo Electrónico</label>
                  <div className="input-wrapper">
                    <input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="form-input"
                      placeholder="ejemplo@correo.com"
                    />
                    <HiMail className="input-icon" />
                  </div>
                </div>

                {error && <div className="msg-error">{error}</div>}

                <button type="submit" disabled={loading} className="btn-primary">
                  {loading ? "Enviando..." : "Enviar enlace"}
                </button>
              </form>
            </>
          ) : (
            <div className="success-box">
              <div className="success-icon-wrapper">
                <HiMail className="text-3xl" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">¡Correo enviado!</h3>
              <p className="text-gray-500 text-sm mb-6">
                Si la cuenta existe, recibirás un correo en <strong>{email}</strong>.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}