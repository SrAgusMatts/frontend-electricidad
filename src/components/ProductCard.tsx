import React from 'react';
import { Producto } from '@/services/api';

interface ProductProps {
  producto: Producto;
}

export default function ProductCard({ producto }: ProductProps) {
  return (
    // Usamos las clases globales directamente (strings)
    <div className="card">
      
      {/* Imagen */}
      <div className="card-image-container">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src={producto.imagenUrl} 
          alt={producto.nombre}
          className="card-image"
        />
      </div>

      {/* Contenido */}
      <div className="card-body">
        <h2 className="text-title-card">
          {producto.nombre}
        </h2>
        <p className="text-desc-card">
          {producto.descripcion}
        </p>
        
        <div className="mt-4 flex justify-between items-center pt-4 border-t border-gray-100">
          <span className="text-price">
            ${producto.precio.toLocaleString()}
          </span>
          <button className="btn-primary">
            Ver más
          </button>
        </div>
      </div>
    </div>
  );
}