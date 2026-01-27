"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { obtenerProductoPorId, obtenerProductos } from "@/services/api";
import Navbar from "@/components/Navbar";
import Toast from "@/components/Toast";
import { HiCheckCircle, HiXCircle, HiX } from "react-icons/hi"; // 👈 Agregamos HiX
import { Producto } from "@/types";
import { useCarrito } from "@/context/CarritoContext";

const WhatsAppIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
  </svg>
);

export default function ProductoDetallePage() {
  const params = useParams();
  const id = Number(params.id);
  const { agregarItem, carrito } = useCarrito();

  const [producto, setProducto] = useState<Producto | null>(null);
  const [relacionados, setRelacionados] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);

  const [cantidad, setCantidad] = useState(1);
  const [inputVisible, setInputVisible] = useState(false);

  const [toast, setToast] = useState({ show: false, message: "", type: "success" as "success" | "error" });

  useEffect(() => {
    cargarDatos();
    setInputVisible(false);
    setCantidad(1);
  }, [id]);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const prodPrincipal = await obtenerProductoPorId(id);
      setProducto(prodPrincipal);
      const todos = await obtenerProductos();

      const sugerencias = todos.filter(p =>
        p.categoriaId === prodPrincipal.categoriaId &&
        p.id !== prodPrincipal.id
      ).slice(0, 3);

      setRelacionados(sugerencias);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // --- MANEJO DEL SELECT Y EL INPUT ---
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === "more") {
      setInputVisible(true);
      setCantidad(1);
    } else {
      setCantidad(Number(val));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = Number(e.target.value);
    if (!producto) return;
    if (val < 1) val = 1;
    if (val > producto.stock) val = producto.stock;
    setCantidad(val);
  };

  // 👇 Función para volver al select
  const handleResetInput = () => {
    setInputVisible(false);
    setCantidad(1);
  };

  const handleAgregarCarrito = () => {
    if (!producto) return;

    const itemEnCarrito = carrito.find((i) => i.producto.id === producto.id);
    const cantidadEnCarrito = itemEnCarrito ? itemEnCarrito.cantidad : 0;
    const totalFinal = cantidadEnCarrito + cantidad;

    if (totalFinal > producto.stock) {
      const disponibles = producto.stock - cantidadEnCarrito;
      let mensaje = disponibles <= 0
        ? "¡Ya tienes todo el stock en tu carrito!"
        : `Solo quedan ${producto.stock}. Puedes agregar ${disponibles} más.`;

      setToast({ show: true, message: mensaje, type: "error" });
      return;
    }

    agregarItem(producto, cantidad);
    setToast({ show: true, message: "¡Agregado al carrito!", type: "success" });
  };

  if (loading) return <div className="page-wrapper items-center justify-center">Cargando...</div>;
  if (!producto) return <div className="page-wrapper items-center justify-center">Producto no encontrado 😕</div>;

  const mensajeWhatsapp = `Hola! Me interesa el producto *${producto.nombre}* que vi en la web.`;
  const linkWhatsapp = `https://wa.me/5493564622216?text=${encodeURIComponent(mensajeWhatsapp)}`;

  // Opciones del select
  const limiteSelect = 6;
  const maxOptions = Math.min(producto.stock, limiteSelect);
  const options = Array.from({ length: maxOptions }, (_, i) => i + 1);

  return (
    <div className="page-wrapper bg-white">
      <Navbar />
      <Toast show={toast.show} message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, show: false })} />

      <div className="product-detail-container">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

          {/* COLUMNA IZQUIERDA */}
          <div className="lg:col-span-2">
            <div className="ml-main-image-container">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={producto.imagenUrl || "/placeholder.png"}
                alt={producto.nombre}
                className="h-full w-full object-contain"
              />
            </div>

            <div className="ml-description-box">
              <h2 className="ml-desc-title">Descripción</h2>
              <p className="ml-desc-text">{producto.descripcion}</p>
            </div>
          </div>

          {/* COLUMNA DERECHA (Panel de Compra) */}
          <div className="lg:col-span-1">
            <div className="ml-purchase-section">

              <div className="ml-meta-text uppercase tracking-wide">
                {producto.categoria?.nombre || "Producto"}
              </div>

              <h1 className="ml-title">{producto.nombre}</h1>

              {producto.marca && (
                <p className="text-sm text-blue-500 font-medium mb-4">
                  Marca: {producto.marca.nombre}
                </p>
              )}

              <div className="ml-price-container">
                <span className="ml-price-real">$ {producto.precio.toLocaleString()}</span>
              </div>

              {/* LOGICA DE STOCK Y SELECTOR */}
              {producto.stock > 0 ? (
                <div className="ml-qty-wrapper">
                  <div className="ml-qty-row">

                    {/* LOGICA VISUAL CAMBIADA */}
                    {inputVisible ? (
                      <div className="ml-input-wrapper">
                        <input
                          type="number"
                          min="1"
                          max={producto.stock}
                          value={cantidad}
                          onChange={handleInputChange}
                          className="ml-qty-input-custom"
                          autoFocus
                        />
                        {/* Botón X para cancelar y volver al select */}
                        <button
                          onClick={handleResetInput}
                          className="ml-qty-reset-btn"
                          title="Volver al selector"
                        >
                          <HiX className="text-lg" />
                        </button>
                      </div>
                    ) : (
                      <div className="w-32">
                        <select
                          value={cantidad}
                          onChange={handleSelectChange}
                          className="ml-qty-select"
                        >
                          {options.map(num => (
                            <option key={num} value={num}>
                              {num} {num === 1 ? "unidad" : "unidades"}
                            </option>
                          ))}

                          {producto.stock > limiteSelect && (
                            <option value="more">Más de {limiteSelect} unidades</option>
                          )}
                        </select>
                      </div>
                    )}

                    <span className="ml-stock-display">
                      ({producto.stock} disponibles)
                    </span>
                  </div>

                  <div className="ml-qty-hint">
                    <div className="flex items-center gap-1 font-medium">
                      <HiCheckCircle className="text-green-500" /> Stock disponible
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm font-bold mb-6 flex items-center gap-2">
                  <HiXCircle className="text-xl" />
                  Sin stock momentáneamente
                </div>
              )}

              {/* BOTONES */}
              <button
                onClick={handleAgregarCarrito}
                disabled={producto.stock === 0}
                className="ml-btn-primary"
              >
                Agregar al carrito
              </button>

              <a
                href={linkWhatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-btn-secondary"
              >
                <WhatsAppIcon />
                Consultar por WhatsApp
              </a>

              <div className="ml-seller-info">
                <div className="ml-seller-text text-center">
                  Vendido por <span className="ml-seller-link text-black font-semibold">Electricidad Mattos</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RELACIONADOS */}
        {relacionados.length > 0 && (
          <div className="border-t border-gray-200 pt-12 mt-12">
            <h2 className="text-2xl font-light text-gray-800 mb-8">Otros productos relacionados</h2>
            <div className="products-grid">
              {relacionados.map((rel) => (
                <Link href={`/productos/${rel.id}`} key={rel.id} className="card group border-0 shadow-sm hover:shadow-lg">
                  <div className="card-image-container border-b-0 h-56">
                    <img src={rel.imagenUrl || "/placeholder.png"} alt={rel.nombre} className="card-image" />
                  </div>
                  <div className="p-4 border-t border-gray-50">
                    <h3 className="text-sm font-normal text-gray-600 line-clamp-2 h-10 mb-2">{rel.nombre}</h3>
                    <p className="text-xl font-normal text-gray-900">$ {rel.precio.toLocaleString()}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}