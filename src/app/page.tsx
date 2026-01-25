"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
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
    <div className="page-wrapper">
      <Navbar />
      
      <Hero />

      {/* Buscador Sticky */}
      <div className="sticky-search-bar">
        <div className="search-container-inner">
            <div className="search-input-wrapper">
                <input 
                    type="text" 
                    placeholder="Buscar productos, marcas y más..." 
                    className="search-input-field"
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                />
                <HiSearch className="search-icon-glass" />
            </div>
        </div>
      </div>

      {/* Contenedor Principal */}
      <div id="catalogo" className="home-layout"> 
        
        {/* SIDEBAR */}
        <aside className="filters-sidebar">
            <h2 className="filters-header">Filtros</h2>

            {/* Chips Activos */}
            {(marcaSeleccionada || categoriaId) && (
                <div className="active-filters-chips">
                    {marcaSeleccionada && (
                        <button onClick={() => setMarcaSeleccionada(null)} className="chip-brand">
                            {marcaSeleccionada} <HiX />
                        </button>
                    )}
                    {categoriaId && (
                        <button onClick={() => setCategoriaId(null)} className="chip-clear">
                            Limpiar Categoría <HiX />
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
                  <p className="filter-empty">Sin marcas disponibles.</p>
                )}
            </div>
        </aside>

        {/* GRILLA PRODUCTOS */}
        <div className="products-area">
            {loading ? (
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                </div>
            ) : (
                <>
                    <div className="results-count">
                        Se encontraron <strong>{productosFiltrados.length}</strong> productos
                    </div>

                    <div className="products-grid">
                        {productosFiltrados.map((prod) => (
                            <div key={prod.id} className="card">
                                <div className="card-image-container">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img 
                                        src={prod.imagenUrl || "/placeholder.png"} 
                                        alt={prod.nombre} 
                                        className="card-image" 
                                    />
                                </div>
                                <div className="card-body">
                                    {prod.marca?.nombre && (
                                        <p className="card-brand">{prod.marca.nombre}</p>
                                    )}
                                    <h3 className="text-title-card" title={prod.nombre}>{prod.nombre}</h3>
                                    
                                    <div className="card-footer">
                                        <span className="text-price">$ {prod.precio.toLocaleString()}</span>
                                        <Link href={`/productos/${prod.id}`} className="btn-primary">
                                            Ver detalle
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
            
            {!loading && productosFiltrados.length === 0 && (
                <div className="empty-state-box">
                    <div className="empty-state-icon">🔍</div>
                    <h3 className="empty-state-title">No encontramos lo que buscás</h3>
                    <p className="empty-state-desc">Probá con otras palabras o revisá las categorías.</p>
                    <button 
                        onClick={() => {setBusqueda(""); setCategoriaId(null); setMarcaSeleccionada(null);}}
                        className="btn-clear-filters"
                    >
                        Limpiar todos los filtros
                    </button>
                </div>
            )}
        </div>
      </div>

      <Footer />
    </div>
  );
}