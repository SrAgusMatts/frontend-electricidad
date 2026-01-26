"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { obtenerProductoPorId, obtenerProductos } from "@/services/api";
import Navbar from "@/components/Navbar";
import { HiCheckCircle, HiXCircle } from "react-icons/hi";
import { Producto } from "@/types";

// Icono de WhatsApp
const WhatsAppIcon = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
  </svg>
);

export default function ProductoDetallePage() {
  const params = useParams();
  const id = Number(params.id);
  
  const [producto, setProducto] = useState<Producto | null>(null);
  const [relacionados, setRelacionados] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarDatos();
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
      console.error("Error cargando datos", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-white flex items-center justify-center">Cargando...</div>;
  if (!producto) return <div className="min-h-screen bg-white flex items-center justify-center">Producto no encontrado 😕</div>;

  const mensajeWhatsapp = `Hola! Me interesa el producto *${producto.nombre}* que vi en la web.`;
  const linkWhatsapp = `https://wa.me/5493564622216?text=${encodeURIComponent(mensajeWhatsapp)}`;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Navbar />
      
      <div className="product-detail-container">
        
        <div className="product-grid mb-20">
          
          <div className="detail-image-wrapper">
            <img 
              src={producto.imagenUrl || "/placeholder.png"} 
              alt={producto.nombre} 
              className="detail-image"
            />
          </div>

          <div className="detail-info">
            <div>
              <span className="detail-category">
                {producto.categoriaId === 1 ? "Cables" : producto.categoriaId === 2 ? "Iluminación" : "Herramientas"}
              </span>
              <h1 className="detail-title mt-4">{producto.nombre}</h1>
              {producto.marca && (
                <p className="text-gray-500 font-medium mt-2 uppercase tracking-wide">
                  Marca: {producto.marca?.nombre}
                </p>
              )}
            </div>

            <div className="detail-price">
              ${producto.precio.toLocaleString()}
            </div>

            <div className="detail-stock">
              {producto.stock > 0 ? (
                <>
                  <HiCheckCircle className="text-green-500 text-xl" />
                  <span>Stock disponible ({producto.stock} u.)</span>
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

            <a 
              href={linkWhatsapp} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn-whatsapp"
            >
              <WhatsAppIcon />
              Consultar por WhatsApp
            </a>
          </div>
        </div>

        {relacionados.length > 0 && (
          <div className="border-t border-gray-200 pt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              También te podría interesar
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {relacionados.map((rel) => (
                <Link href={`/productos/${rel.id}`} key={rel.id} className="group">
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all">
                    
                    <div className="h-48 bg-white p-4 flex items-center justify-center relative border-b border-gray-50">
                       <img 
                          src={rel.imagenUrl} 
                          alt={rel.nombre} 
                          className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform" 
                       />
                    </div>

                    <div className="p-4">
                      <p className="text-xs text-blue-600 font-bold uppercase mb-1">
                        {rel.categoriaId === 1 ? "Cables" : rel.categoriaId === 2 ? "Iluminación" : "Herramientas"}
                      </p>
                      <h3 className="text-gray-900 font-semibold truncate">
                        {rel.nombre}
                      </h3>
                      <p className="text-green-600 font-bold mt-2">
                        ${rel.precio.toLocaleString()}
                      </p>
                    </div>
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