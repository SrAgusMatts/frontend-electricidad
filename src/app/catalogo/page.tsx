"use client";

import { useState, useEffect, useMemo } from "react";
import { Producto, Categoria, Marca } from "@/types";
import { obtenerProductos } from "@/services/api";
import { agruparPorMarca } from "@/utils/agruparProductos";
import ProductCard from "@/components/ProductCard";

export default function CatalogoPage() {
  const [todosLosProductos, setTodosLosProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);

  // Filtros
  const [busqueda, setBusqueda] = useState("");
  const [marcasSeleccionadas, setMarcasSeleccionadas] = useState<number[]>([]);
  const [categoriasSeleccionadas, setCategoriasSeleccionadas] = useState<number[]>([]);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const prods = await obtenerProductos();
        setTodosLosProductos(prods);
      } catch (error) {
        console.error("Error cargando productos:", error);
      } finally {
        setLoading(false);
      }
    };
    cargarDatos();
  }, []);

  // Helpers
  const marcasDisponibles = useMemo(() => {
    const mapa = new Map<number, Marca>();
    todosLosProductos.forEach(p => p.marca && mapa.set(p.marca.id, p.marca));
    return Array.from(mapa.values());
  }, [todosLosProductos]);

  const categoriasDisponibles = useMemo(() => {
    const mapa = new Map<number, Categoria>();
    todosLosProductos.forEach(p => p.categoria && mapa.set(p.categoria.id, p.categoria));
    return Array.from(mapa.values());
  }, [todosLosProductos]);

  // Filtrado
  const productosFiltrados = useMemo(() => {
    return todosLosProductos.filter((prod) => {
      const matchTexto = busqueda === "" || prod.nombre.toLowerCase().includes(busqueda.toLowerCase());
      const matchMarca = marcasSeleccionadas.length === 0 || (prod.marca?.id && marcasSeleccionadas.includes(prod.marca.id));
      const matchCat = categoriasSeleccionadas.length === 0 || (prod.categoria?.id && categoriasSeleccionadas.includes(prod.categoria.id));
      return matchTexto && matchMarca && matchCat;
    });
  }, [todosLosProductos, busqueda, marcasSeleccionadas, categoriasSeleccionadas]);

  const productosAgrupados = useMemo(() => agruparPorMarca(productosFiltrados), [productosFiltrados]);

  // Handlers
  const toggleMarca = (id: number) => setMarcasSeleccionadas(prev => prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]);
  const toggleCategoria = (id: number) => setCategoriasSeleccionadas(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]);

  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mb-4"></div>
      <p className="text-slate-600 font-medium">Cargando el mejor material eléctrico...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 pb-20 font-sans">

      {/* 1. HERO SECTION (Fondo Azul Oscuro) */}
      <div className="catalog-header-bg">
        <div className="catalog-header-container">
          <h1 className="catalog-title">Catálogo Completo</h1>
          <p className="catalog-subtitle">Explorá nuestro stock de primeras marcas. Calidad garantizada para tus proyectos eléctricos.</p>
        </div>
      </div>

      {/* 2. BUSCADOR FLOTANTE (Se monta sobre el azul y el gris) */}
      <div className="catalog-search-wrapper">
        <div className="catalog-search-inner">
          {/* Icono Lupa SVG */}
          <span className="catalog-search-icon">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Buscar por nombre, marca o código..."
            className="catalog-search-input"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 w-full">
        <div className="flex flex-col md:flex-row gap-8">

          {/* === 3. SIDEBAR CON ESTILO === */}
          <aside className="catalog-sidebar-card">

            {/* Filtro Marcas */}
            <div className="mb-6">
              <h3 className="catalog-filter-title">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" /></svg>
                Marcas
              </h3>
              <div className="catalog-filter-list">
                {marcasDisponibles.map(marca => (
                  <label key={marca.id} className="catalog-filter-item group">
                    <input
                      type="checkbox"
                      className="catalog-checkbox"
                      checked={marcasSeleccionadas.includes(marca.id)}
                      onChange={() => toggleMarca(marca.id)}
                    />
                    <span className={`group-hover:text-blue-600 ${marcasSeleccionadas.includes(marca.id) ? 'font-bold text-slate-900' : ''}`}>
                      {marca.nombre}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="catalog-divider" />

            {/* Filtro Categorías */}
            <div className="mb-2">
              <h3 className="catalog-filter-title">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M2 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 002 2H4a2 2 0 01-2-2V5zm3 1h6v4H5V6zm6 6H5v2h6v-2z" clipRule="evenodd" /><path d="M15 7h1a2 2 0 012 2v5.5a1.5 1.5 0 01-3 0V7z" /></svg>
                Categorías
              </h3>
              <div className="catalog-filter-list">
                {categoriasDisponibles.map(cat => (
                  <label key={cat.id} className="catalog-filter-item group">
                    <input
                      type="checkbox"
                      className="catalog-checkbox"
                      checked={categoriasSeleccionadas.includes(cat.id)}
                      onChange={() => toggleCategoria(cat.id)}
                    />
                    <span className={`group-hover:text-blue-600 ${categoriasSeleccionadas.includes(cat.id) ? 'font-bold text-slate-900' : ''}`}>
                      {cat.nombre}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </aside>

          {/* === 4. CONTENIDO PRINCIPAL === */}
          <main className="catalog-main-content">
            {Object.keys(productosAgrupados).length === 0 ? (
              <div className="catalog-empty-state">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-slate-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-xl font-bold text-slate-700">No encontramos productos.</p>
                <p className="text-sm mt-2 text-slate-500">Intenta ajustar los filtros de búsqueda.</p>
                <button
                  onClick={() => { setBusqueda(''); setMarcasSeleccionadas([]); setCategoriasSeleccionadas([]) }}
                  className="mt-6 text-blue-600 hover:underline font-medium"
                >
                  Limpiar todos los filtros
                </button>
              </div>
            ) : (
              Object.entries(productosAgrupados).map(([nombreMarca, productos]) => (
                <section key={nombreMarca} className="catalog-brand-section">
                  {/* Encabezado de Marca (estilo tarjeta interna) */}
                  <div className="catalog-brand-header">
                    <h2 className="catalog-brand-title">{nombreMarca}</h2>
                    <span className="text-sm font-medium text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
                      {productos.length} productos
                    </span>
                  </div>

                  <div className="catalog-products-grid">
                    {productos.map(prod => (
                      <ProductCard key={prod.id} producto={prod} />
                    ))}
                  </div>
                </section>
              ))
            )}
          </main>

        </div>
      </div>
    </div>
  );
}