"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { obtenerProductos, Producto } from "@/services/api";
import { HiSearch, HiX } from "react-icons/hi";

export default function Home() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);

  // Filtros
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

  // --- LÓGICA DE FILTRADO ---
  const productosFiltrados = productos.filter((prod) => {
    const matchTexto = prod.nombre.toLowerCase().includes(busqueda.toLowerCase());
    const matchCategoria = categoriaId ? prod.categoriaId === categoriaId : true;
    const matchMarca = marcaSeleccionada ? prod.marca === marcaSeleccionada : true;

    return matchTexto && matchCategoria && matchMarca;
  });

  const marcasDisponibles = Array.from(new Set(productos.map(p => p.marca))).filter(Boolean);

  // Contamos cuántos hay de cada marca (opcional, queda pro)
  const contarPorMarca = (marca: string) => productos.filter(p => p.marca === marca).length;

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      {/* Barra Amarilla tipo ML (Opcional, si te gusta el buscador arriba del todo) */}
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

        {/* === SIDEBAR IZQUIERDA (FILTROS) === */}
        <aside className="filters-sidebar hidden md:block"> {/* Oculto en celular por ahora */}

          {/* Título de lo que estamos viendo */}
          <h2 className="text-xl font-bold text-gray-800 mb-6">
            {categoriaId === 1 ? "Cables" : categoriaId === 2 ? "Iluminación" : categoriaId === 3 ? "Herramientas" : "Catálogo Completo"}
          </h2>

          {/* Filtro Activo (Chips para borrar) */}
          {(marcaSeleccionada || categoriaId) && (
            <div className="mb-6">
              {marcaSeleccionada && (
                <button onClick={() => setMarcaSeleccionada(null)} className="flex items-center gap-1 text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full mb-2 hover:bg-blue-200">
                  Marca: {marcaSeleccionada} <HiX />
                </button>
              )}
              {categoriaId && (
                <button onClick={() => setCategoriaId(null)} className="flex items-center gap-1 text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full hover:bg-blue-200">
                  Limpiar Categoría <HiX />
                </button>
              )}
            </div>
          )}

          {/* Sección: Categorías */}
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
          </div>
        </aside>

        {/* === GRILLA DERECHA (PRODUCTOS) === */}
        <div className="products-grid-container">
          {loading ? (
            <p>Cargando...</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {productosFiltrados.map((prod) => (
                <div key={prod.id} className="bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow overflow-hidden">
                  <div className="h-48 bg-white p-4 flex items-center justify-center relative border-b border-gray-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={prod.imagenUrl} alt={prod.nombre} className="max-h-full max-w-full object-contain" />
                  </div>
                  <div className="p-4">
                    <h3 className="text-gray-800 text-sm font-medium line-clamp-2 mb-2 h-10">{prod.nombre}</h3>

                    {prod.marca && (
                      <p className="text-xs text-gray-400 mb-2 uppercase font-semibold">{prod.marca}</p>
                    )}

                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-2xl text-gray-900 font-light">
                        $ {prod.precio.toLocaleString()}
                      </span>
                    </div>

                    <Link href={`/productos/${prod.id}`} className="block w-full text-center py-2 rounded bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors">
                      Ver detalle
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          {productosFiltrados.length === 0 && (
            <div className="bg-white p-10 text-center rounded-lg shadow-sm">
              <h3 className="text-lg font-medium text-gray-900">No hay publicaciones que coincidan con tu búsqueda.</h3>
              <ul className="text-gray-500 mt-2 list-disc list-inside">
                <li>Revisá la ortografía de la palabra.</li>
                <li>Utilizá palabras más genéricas o menos palabras.</li>
                <li>Navegá por las categorías para encontrar un producto similar.</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}