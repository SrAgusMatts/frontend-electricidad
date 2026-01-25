"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { obtenerProductoPorId, Producto } from "@/services/api";
import Navbar from "@/components/Navbar";
import { HiShoppingCart, HiCheckCircle, HiXCircle } from "react-icons/hi";

// Icono de WhatsApp (SVG manual porque a veces react-icons no lo trae por defecto en libs viejas)
const WhatsAppIcon = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
  </svg>
);

export default function ProductoDetallePage() {
  const params = useParams();
  const id = Number(params.id);
  const [producto, setProducto] = useState<Producto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarProducto();
  }, []);

  const cargarProducto = async () => {
    try {
      const data = await obtenerProductoPorId(id);
      setProducto(data);
    } catch (error) {
      console.error("Producto no encontrado");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-white flex items-center justify-center">Cargando...</div>;
  if (!producto) return <div className="min-h-screen bg-white flex items-center justify-center">Producto no encontrado 😕</div>;

  // Link para enviar mensaje directo al WhatsApp
  const mensajeWhatsapp = `Hola! Me interesa el producto *${producto.nombre}* que vi en la web.`;
  const linkWhatsapp = `https://wa.me/5493564000000?text=${encodeURIComponent(mensajeWhatsapp)}`; // ⚠️ CAMBIAR NUMERO

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="product-detail-container">
        <div className="product-grid">
          
          {/* 1. Columna Imagen */}
          <div className="detail-image-wrapper">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={producto.imagenUrl || "/placeholder.png"} 
              alt={producto.nombre} 
              className="detail-image"
            />
          </div>

          {/* 2. Columna Información */}
          <div className="detail-info">
            
            <div>
              <span className="detail-category">
                {producto.categoriaId === 1 ? "Cables" : producto.categoriaId === 2 ? "Iluminación" : "Herramientas"}
              </span>
              <h1 className="detail-title mt-4">{producto.nombre}</h1>
            </div>

            <div className="detail-price">
              ${producto.precio.toLocaleString()}
            </div>

            {/* Stock con indicador de color */}
            <div className="detail-stock">
              {producto.stock > 0 ? (
                <>
                  <HiCheckCircle className="text-green-500 text-xl" />
                  <span>Stock disponible ({producto.stock} unidades)</span>
                </>
              ) : (
                <>
                  <HiXCircle className="text-red-500 text-xl" />
                  <span className="text-red-500">Sin stock momentáneamente</span>
                </>
              )}
            </div>

            <p className="detail-description">
              {producto.descripcion}
            </p>

            {/* Botón de Acción */}
            <a 
              href={linkWhatsapp} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn-whatsapp"
            >
              <WhatsAppIcon />
              Consultar por WhatsApp
            </a>

            <p className="text-xs text-gray-400 text-center mt-4">
              * Los precios pueden variar sin previo aviso.
            </p>

          </div>
        </div>
      </div>
    </div>
  );
}