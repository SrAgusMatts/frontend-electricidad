"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { obtenerProductos, Producto } from "@/services/api";
import { HiSearch, HiX } from "react-icons/hi";

export default function Home() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [categoriaId, setCategoriaId] = useState<number | null>(null);
  const [marcaSeleccionada, setMarcaSeleccionada] = useState<string | null>(null);

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    try {
      const data = await obtenerProductos();
      setProductos(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const productosFiltrados = productos.filter((prod) => {
    const matchTexto = prod.nombre.toLowerCase().includes(busqueda.toLowerCase());
    const matchCategoria = categoriaId ? prod.categoriaId === categoriaId : true;

    const matchMarca = marcaSeleccionada ? prod.marca?.nombre === marcaSeleccionada : true;

    return matchTexto && matchCategoria && matchMarca;
  });


  const marcasDisponibles = Array.from(
    new Set(productos.map(p => p.marca?.nombre))
  ).filter(Boolean) as string[];

  const contarPorMarca = (nombreMarca: string) =>
    productos.filter(p => p.marca?.nombre === nombreMarca).length;

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="bg-white shadow-sm border-b border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-4">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Buscar productos, marcas y más..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
            <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
        </div>
      </div>

      <div className="home-container">

        <aside className="filters-sidebar hidden md:block">

          <h2 className="text-xl font-bold text-gray-800 mb-6">
            {categoriaId === 1 ? "Cables" : categoriaId === 2 ? "Iluminación" : categoriaId === 3 ? "Herramientas" : "Catálogo Completo"}
          </h2>

          {(marcaSeleccionada || categoriaId) && (
            <div className="mb-6 flex flex-wrap gap-2">
              {marcaSeleccionada && (
                <button onClick={() => setMarcaSeleccionada(null)} className="flex items-center gap-1 text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full hover:bg-blue-200 font-semibold">
                  {marcaSeleccionada} <HiX />
                </button>
              )}
              {categoriaId && (
                <button onClick={() => setCategoriaId(null)} className="flex items-center gap-1 text-xs bg-gray-200 text-gray-700 px-3 py-1 rounded-full hover:bg-gray-300 font-semibold">
                  Ver todo <HiX />
                </button>
              )}
            </div>
          )}

          <div className="filter-section">
            <h3 className="filter-title">Categorías</h3>
            <ul className="filter-list">
              <li className={`filter-item ${!categoriaId ? "active" : ""}`} onClick={() => setCategoriaId(null)}>
                Todas
              </li>
              <li className={`filter-item ${categoriaId === 1 ? "active" : ""}`} onClick={() => setCategoriaId(1)}>
                Cables
              </li>
              <li className={`filter-item ${categoriaId === 2 ? "active" : ""}`} onClick={() => setCategoriaId(2)}>
                Iluminación
              </li>
              <li className={`filter-item ${categoriaId === 3 ? "active" : ""}`} onClick={() => setCategoriaId(3)}>
                Herramientas
              </li>
            </ul>
          </div>

          <div className="filter-section">
            <h3 className="filter-title">Marcas</h3>
            {marcasDisponibles.length > 0 ? (
              <ul className="filter-list">
                {marcasDisponibles.map(marca => (
                  <li
                    key={marca}
                    className={`filter-item ${marcaSeleccionada === marca ? "active" : ""}`}
                    onClick={() => setMarcaSeleccionada(marca === marcaSeleccionada ? null : marca)}
                  >
                    <span>{marca}</span>
                    <span className="filter-count">({contarPorMarca(marca)})</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-gray-400 italic">No hay marcas registradas en estos productos.</p>
            )}
          </div>
        </aside>

        <div className="products-grid-container">
          {loading ? (
            <p className="text-center py-10 text-gray-500">Cargando catálogo...</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {productosFiltrados.map((prod) => (
                <div key={prod.id} className="bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow overflow-hidden group">
                  <div className="h-48 bg-white p-4 flex items-center justify-center relative border-b border-gray-50">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={prod.imagenUrl || "/placeholder.png"} alt={prod.nombre} className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300" />
                  </div>
                  <div className="p-4">
                    <h3 className="text-gray-800 text-sm font-medium line-clamp-2 mb-1 h-10">{prod.nombre}</h3>

                    {prod.marca?.nombre && (
                      <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-2">
                        {prod.marca.nombre}
                      </p>
                    )}

                    <div className="mt-2">
                      <span className="text-xl text-gray-900 font-light block">
                        $ {prod.precio.toLocaleString()}
                      </span>
                    </div>

                    <Link href={`/productos/${prod.id}`} className="block w-full text-center py-2 mt-3 rounded bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors">
                      Ver detalle
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && productosFiltrados.length === 0 && (
            <div className="bg-white p-10 text-center rounded-lg shadow-sm">
              <h3 className="text-lg font-medium text-gray-900">Sin resultados 😕</h3>
              <p className="text-gray-500 mt-1">Intentá buscar con otras palabras o quitá los filtros.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}