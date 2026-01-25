"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation"; // 👈 useParams para leer el ID de la URL
import { obtenerProductoPorId, actualizarProducto } from "@/services/api";
import Navbar from "@/components/Navbar";
import Toast from "@/components/Toast";
import Link from "next/link";
import { HiSave, HiArrowLeft } from "react-icons/hi";

export default function EditarProductoPage() {
  const router = useRouter();
  const params = useParams();
  const idProducto = Number(params.id);

  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState("");
  const [imagenUrl, setImagenUrl] = useState("");
  const [stock, setStock] = useState("");
  const [categoriaId, setCategoriaId] = useState("1");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" as "success" | "error" });

  // 1. Cargar datos del producto al entrar
  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const prod = await obtenerProductoPorId(idProducto);
      // Rellenamos el formulario
      setNombre(prod.nombre);
      setDescripcion(prod.descripcion);
      setPrecio(prod.precio.toString());
      setImagenUrl(prod.imagenUrl);
      setStock(prod.stock.toString());
      setCategoriaId(prod.categoriaId ? prod.categoriaId.toString() : "1");
    } catch (error) {
      setToast({ show: true, message: "Error al cargar producto", type: "error" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await actualizarProducto(idProducto, {
        id: idProducto,
        nombre,
        descripcion,
        precio: parseFloat(precio),
        imagenUrl,
        stock: parseInt(stock),
        categoriaId: parseInt(categoriaId)
      });

      setToast({ show: true, message: "¡Producto actualizado!", type: "success" });
      
      setTimeout(() => {
        router.push("/admin/panel"); // Volvemos al panel
      }, 1500);

    } catch (error) {
      setToast({ show: true, message: "Error al guardar cambios.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Toast show={toast.show} message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, show: false })} />

      <div className="admin-container">
        <div className="admin-card">
            
          <div className="flex justify-between items-center mb-6 border-b pb-4 border-gray-100">
             <h1 className="text-2xl font-bold text-gray-900">Editar Producto #{idProducto}</h1>
             <Link href="/admin/panel" className="text-gray-500 hover:text-gray-700 flex items-center gap-1">
                <HiArrowLeft /> Volver
             </Link>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Nombre */}
            <div className="mb-4">
              <label className="form-label">Nombre del Producto</label>
              <input type="text" className="form-input" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
            </div>

            {/* Categoría */}
            <div className="mb-4">
              <label className="form-label">Categoría</label>
              <select className="form-input" value={categoriaId} onChange={(e) => setCategoriaId(e.target.value)}>
                <option value="1">🔌 Cables</option>
                <option value="2">💡 Iluminación</option>
                <option value="3">🔧 Herramientas</option>
              </select>
            </div>

            {/* Descripción */}
            <div className="mb-4">
              <label className="form-label">Descripción</label>
              <textarea className="form-input" rows={3} value={descripcion} onChange={(e) => setDescripcion(e.target.value)} required />
            </div>

            {/* Precio y Stock */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="form-label">Precio ($)</label>
                <input type="number" className="form-input" value={precio} onChange={(e) => setPrecio(e.target.value)} required />
              </div>
              <div>
                <label className="form-label">Stock</label>
                <input type="number" className="form-input" value={stock} onChange={(e) => setStock(e.target.value)} required />
              </div>
            </div>

            {/* URL Imagen */}
            <div className="mb-6">
              <label className="form-label">URL de la Imagen</label>
              <input type="url" className="form-input" value={imagenUrl} onChange={(e) => setImagenUrl(e.target.value)} required />
            </div>

            {/* Botones */}
            <button type="submit" className="btn-save" disabled={loading}>
              <HiSave className="text-xl" />
              {loading ? "Guardando..." : "Guardar Cambios"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}