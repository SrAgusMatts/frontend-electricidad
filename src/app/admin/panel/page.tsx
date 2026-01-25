"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Toast from "@/components/Toast";
import { obtenerProductos, eliminarProducto, Producto } from "@/services/api";
import { HiSearch, HiPencil, HiTrash, HiPlus } from "react-icons/hi";

export default function AdminPanelPage() {
    const [productos, setProductos] = useState<Producto[]>([]);
    const [busqueda, setBusqueda] = useState("");
    const [filtroCategoria, setFiltroCategoria] = useState("todos");
    const [toast, setToast] = useState({ show: false, message: "", type: "success" as "success" | "error" });

    useEffect(() => {
        cargarProductos();
    }, []);

    const cargarProductos = async () => {
        const data = await obtenerProductos();
        setProductos(data);
    };

    const handleBorrar = async (id: number) => {
        if (confirm("¿Estás seguro de eliminar este producto? No hay vuelta atrás.")) {
            try {
                await eliminarProducto(id);
                setToast({ show: true, message: "Producto eliminado", type: "success" });
                cargarProductos();
            } catch (error) {
                setToast({ show: true, message: "Error al eliminar", type: "error" });
            }
        }
    };

    const productosFiltrados = productos.filter((prod) => {
        const coincideNombre = prod.nombre.toLowerCase().includes(busqueda.toLowerCase());
        const coincideCategoria = filtroCategoria === "todos"
            ? true
            : prod.categoriaId?.toString() === filtroCategoria;

        return coincideNombre && coincideCategoria;
    });

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <Toast show={toast.show} message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, show: false })} />

            <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">

                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Panel de Control</h1>
                    <Link href="/admin/nuevo-producto" className="btn-panel-create">
                        <HiPlus className="text-xl" />
                        Nuevo Producto
                    </Link>
                </div>

                <div className="filter-bar">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <HiSearch className="text-gray-400" />
                        </div>
                        <input
                            type="text"
                            className="search-input"
                            placeholder="Buscar por nombre..."
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                        />
                    </div>

                    <select
                        className="category-select"
                        value={filtroCategoria}
                        onChange={(e) => setFiltroCategoria(e.target.value)}
                    >
                        <option value="todos">Todas las categorías</option>
                        <option value="1">🔌 Cables</option>
                        <option value="2">💡 Iluminación</option>
                        <option value="3">🔧 Herramientas</option>
                    </select>
                </div>

                {/* Tabla */}
                <div className="table-container">
                    <table className="admin-table">
                        <thead className="table-head">
                            <tr>
                                <th className="th-cell">ID</th>
                                <th className="th-cell">Producto</th>
                                <th className="th-cell">Categoría</th>
                                <th className="th-cell">Precio</th>
                                <th className="th-cell">Stock</th>
                                <th className="th-cell">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {productosFiltrados.map((prod) => (
                                <tr key={prod.id} className="tbody-row">
                                    <td className="td-cell text-gray-500">#{prod.id}</td>

                                    <td className="td-cell font-medium text-gray-900 flex items-center gap-3">
                                        <img src={prod.imagenUrl} alt="" className="h-10 w-10 rounded-full object-cover border" />
                                        {prod.nombre}
                                    </td>

                                    <td className="td-cell">
                                        <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded-full">
                                            {prod.categoriaId === 1 ? "Cables" : prod.categoriaId === 2 ? "Iluminación" : "Otros"}
                                        </span>
                                    </td>

                                    <td className="td-cell text-green-600 font-bold">
                                        ${prod.precio.toLocaleString()}
                                    </td>

                                    <td className="td-cell">
                                        {prod.stock < 5 ? (
                                            <span className="text-red-600 font-bold">⚠️ {prod.stock}</span>
                                        ) : (
                                            <span className="text-gray-600">{prod.stock}</span>
                                        )}
                                    </td>

                                    <td className="td-cell">
                                        <Link href={`/admin/editar-producto/${prod.id}`} className="action-btn-edit">
                                            <HiPencil className="text-lg" />
                                        </Link>
                                        <button
                                            onClick={() => handleBorrar(prod.id)}
                                            className="action-btn-delete"
                                        >
                                            <HiTrash className="text-lg" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {productosFiltrados.length === 0 && (
                        <div className="p-8 text-center text-gray-500">
                            No se encontraron productos con ese filtro.
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}