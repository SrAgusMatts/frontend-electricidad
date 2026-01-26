"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { HiTrash, HiArrowLeft, HiCheckCircle, HiOutlineEmojiSad } from "react-icons/hi";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Toast from "@/components/Toast";
import { useCarrito } from "@/context/CarritoContext";
import { useAuth } from "@/context/AuthContext";
import { crearPedido } from "@/services/api";

export default function CarritoPage() {
  const router = useRouter();
  const { carrito, removerItem, limpiarCarrito, total } = useCarrito();
  const { usuario } = useAuth();

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" as "success" | "error" });

  const [formData, setFormData] = useState({
    nombreCliente: "",
    email: "",
    telefono: ""
  });

  useEffect(() => {
    if (usuario) {
      setFormData((prev) => ({
        ...prev,
        nombreCliente: usuario.nombre,
        email: usuario.email
      }));
    }
  }, [usuario]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleConfirmarCompra = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const pedidoDto = {
        nombreCliente: formData.nombreCliente,
        email: formData.email,
        telefono: formData.telefono,
        items: carrito.map((item) => ({
          productoId: item.producto.id,
          cantidad: item.cantidad
        }))
      };

      console.log("📦 Enviando pedido:", JSON.stringify(pedidoDto, null, 2));

      const respuesta = await crearPedido(pedidoDto);

      setToast({ show: true, message: "¡Pedido confirmado con éxito!", type: "success" });
      limpiarCarrito();

      setTimeout(() => {
        router.push("/");
      }, 2500);

    } catch (error: any) {
      setToast({ show: true, message: error.message || "Error al procesar el pedido", type: "error" });
      setLoading(false);
    }
  };

  if (carrito.length === 0) {
    return (
      <div className="page-wrapper">
        <Navbar />
        <main className="main-container flex flex-col items-center justify-center py-20 px-4 text-center">
            <HiOutlineEmojiSad className="text-6xl text-gray-300 mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Tu carrito está vacío</h2>
            <p className="text-gray-500 mb-8">Parece que todavía no agregaste nada.</p>
            <Link href="/" className="btn-primary max-w-xs mx-auto flex items-center gap-2 justify-center">
                <HiArrowLeft /> Volver al Catálogo
            </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <Navbar />
      <Toast 
        show={toast.show} 
        message={toast.message} 
        type={toast.type} 
        onClose={() => setToast({ ...toast, show: false })} 
      />

      <main className="max-w-7xl mx-auto px-4 py-10 w-full">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-2">
            🛒 Finalizar Compra
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* COLUMNA IZQUIERDA: LISTA DE PRODUCTOS */}
            <div className="lg:col-span-2 space-y-4">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="p-4 text-sm font-semibold text-gray-600">Producto</th>
                                <th className="p-4 text-sm font-semibold text-gray-600 text-center">Cant.</th>
                                <th className="p-4 text-sm font-semibold text-gray-600 text-right">Subtotal</th>
                                <th className="p-4 text-sm font-semibold text-gray-600 text-center">Acción</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {carrito.map((item) => (
                                <tr key={item.producto.id} className="group hover:bg-gray-50 transition-colors">
                                    <td className="p-4">
                                        <div className="flex items-center gap-4">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img 
                                                src={item.producto.imagenUrl || "/placeholder.png"} 
                                                alt={item.producto.nombre} 
                                                className="w-16 h-16 object-contain rounded bg-white border border-gray-100"
                                            />
                                            <div>
                                                <p className="font-bold text-gray-800">{item.producto.nombre}</p>
                                                <p className="text-sm text-gray-500">$ {item.producto.precio.toLocaleString()} x u.</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 text-center font-medium text-gray-700">
                                        {item.cantidad}
                                    </td>
                                    <td className="p-4 text-right font-bold text-blue-600">
                                        $ {(item.producto.precio * item.cantidad).toLocaleString()}
                                    </td>
                                    <td className="p-4 text-center">
                                        <button 
                                            onClick={() => removerItem(item.producto.id)}
                                            className="text-gray-400 hover:text-red-500 transition-colors p-2"
                                            title="Eliminar del carrito"
                                        >
                                            <HiTrash className="text-xl" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg border border-gray-200 text-sm text-gray-600">
                    <span>Tenés <strong>{carrito.length}</strong> productos en el carrito</span>
                    <button onClick={limpiarCarrito} className="text-red-500 hover:underline">
                        Vaciar Carrito
                    </button>
                </div>
            </div>

            <div className="lg:col-span-1">
                <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 sticky top-24">
                    <h2 className="text-xl font-bold text-gray-900 mb-6 border-b pb-4">Datos del Cliente</h2>
                    
                    <form onSubmit={handleConfirmarCompra} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
                            <input 
                                type="text" 
                                name="nombreCliente"
                                required
                                className="form-input"
                                placeholder="Ej: Juan Pérez"
                                value={formData.nombreCliente}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input 
                                type="email" 
                                name="email"
                                required
                                className="form-input"
                                placeholder="juan@ejemplo.com"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono (WhatsApp)</label>
                            <input 
                                type="tel" 
                                name="telefono"
                                required
                                className="form-input"
                                placeholder="Ej: 3564 123456"
                                value={formData.telefono}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="border-t border-gray-200 pt-4 mt-6">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-gray-600">Subtotal</span>
                                <span className="font-semibold">$ {total.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center text-xl font-bold text-gray-900 mt-2">
                                <span>Total a Pagar</span>
                                <span>$ {total.toLocaleString()}</span>
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading}
                            className={`w-full py-4 rounded-xl text-white font-bold text-lg shadow-lg mt-6 flex justify-center items-center gap-2 transition-all ${
                                loading 
                                ? "bg-gray-400 cursor-not-allowed" 
                                : "bg-green-600 hover:bg-green-700 hover:shadow-green-500/30 transform hover:-translate-y-1"
                            }`}
                        >
                            {loading ? "Procesando..." : (
                                <>
                                    <HiCheckCircle className="text-2xl" /> Confirmar Pedido
                                </>
                            )}
                        </button>
                        
                        <p className="text-xs text-center text-gray-400 mt-4">
                            Al confirmar, nos pondremos en contacto para coordinar el pago y envío.
                        </p>
                    </form>
                </div>
            </div>

        </div>
      </main>
      <Footer />
    </div>
  );
}