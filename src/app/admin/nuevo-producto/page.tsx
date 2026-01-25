"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { crearProducto } from "@/services/api";
import Navbar from "@/components/Navbar";
import Toast from "@/components/Toast";
import { HiSave, HiArrowLeft, HiPhotograph } from "react-icons/hi";
import Link from "next/link";

export default function NuevoProductoPage() {
    const router = useRouter();

    // Estado para la notificación
    const [toast, setToast] = useState({ show: false, message: "", type: "success" as "success" | "error" });

    // Estados del formulario
    const [nombre, setNombre] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [precio, setPrecio] = useState("");
    const [imagenUrl, setImagenUrl] = useState("");
    const [stock, setStock] = useState("10");
    const [loading, setLoading] = useState(false);
    const [categoriaId, setCategoriaId] = useState("1");
    const [imagenArchivo, setImagenArchivo] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [marca, setMarca] = useState("");

    useEffect(() => {
        const usuario = JSON.parse(localStorage.getItem("usuarioMattos") || "null");
        if (!usuario || usuario.rol !== "Admin") {
            router.push("/");
        }
    }, [router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const formData = new FormData();
            formData.append("Nombre", nombre);
            formData.append("Descripcion", descripcion);
            formData.append("Precio", precio);
            formData.append("Stock", stock);
            formData.append("CategoriaId", categoriaId);
            formData.append("Marca", marca);

            if (imagenArchivo) {
                formData.append("Imagen", imagenArchivo);
            }

            // 2. Enviamos el FormData
            await crearProducto(formData);

            setToast({ show: true, message: "¡Producto creado con éxito!", type: "success" });
            setTimeout(() => router.push("/"), 1500);

        } catch (error) {
            setToast({ show: true, message: "Error al guardar.", type: "error" });
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImagenArchivo(file);
            setPreview(URL.createObjectURL(file)); // Creamos una URL temporal para verla
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <Toast show={toast.show} message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, show: false })} />

            <div className="admin-container">
                <div className="admin-card">
                    <h1 className="admin-title">Nuevo Producto</h1>

                    <form onSubmit={handleSubmit}>

                        {/* Nombre */}
                        <div className="mb-4">
                            <label className="form-label">Nombre del Producto</label>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="Ej: Lámpara LED 9W"
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                                required
                            />
                        </div>

                        {/* Selector de Categoría */}
                        <div className="mb-4">
                            <label className="form-label">Categoría</label>
                            <select
                                className="form-input"
                                value={categoriaId}
                                onChange={(e) => setCategoriaId(e.target.value)}
                            >
                                <option value="1">🔌 Cables</option>
                                <option value="2">💡 Iluminación</option>
                                <option value="3">🔧 Accesorios / Herramientas</option>
                            </select>
                        </div>

                        {/* Marca */}
                        <div className="mb-4">
                            <div>
                                <label className="form-label">Marca</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="Ej: Schneider, Philips"
                                    value={marca}
                                    onChange={(e) => setMarca(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Descripción */}
                        <div className="mb-4">
                            <label className="form-label">Descripción</label>
                            <textarea
                                className="form-input"
                                rows={3}
                                placeholder="Detalles técnicos..."
                                value={descripcion}
                                onChange={(e) => setDescripcion(e.target.value)}
                                required
                            />
                        </div>

                        {/* Precio y Stock (en 2 columnas) */}
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="form-label">Precio ($)</label>
                                <input
                                    type="number"
                                    className="form-input"
                                    placeholder="0.00"
                                    value={precio}
                                    onChange={(e) => setPrecio(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label className="form-label">Stock Inicial</label>
                                <input
                                    type="number"
                                    className="form-input"
                                    value={stock}
                                    onChange={(e) => setStock(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        {/* URL Imagen */}
                        <div className="mb-6">
                            <label className="form-label">Imagen del Producto</label>

                            <div className="flex items-center gap-4">
                                {/* Botón visual para subir */}
                                <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg border border-gray-300 flex items-center gap-2 transition-colors">
                                    <HiPhotograph className="text-xl" />
                                    <span>Elegir archivo...</span>
                                    <input
                                        type="file"
                                        accept="image/*" // Solo acepta imágenes
                                        className="hidden" // Ocultamos el input feo original
                                        onChange={handleFileChange}
                                    />
                                </label>

                                {/* Nombre del archivo seleccionado */}
                                <span className="text-sm text-gray-500 italic">
                                    {imagenArchivo ? imagenArchivo.name : "Ningún archivo seleccionado"}
                                </span>
                            </div>

                            {/* Previsualización */}
                            {preview && (
                                <div className="mt-4">
                                    <p className="text-xs text-gray-500 mb-1">Vista previa:</p>
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={preview} alt="Vista previa" className="h-32 w-32 object-cover rounded-lg border border-gray-300 shadow-sm" />
                                </div>
                            )}
                        </div>

                        {/* Botones */}
                        <button type="submit" className="btn-save" disabled={loading}>
                            <HiSave className="text-xl" />
                            {loading ? "Guardando..." : "Guardar Producto"}
                        </button>

                        <Link href="/" className="btn-cancel">
                            Cancelar
                        </Link>

                    </form>
                </div>
            </div >
        </div >
    );
}