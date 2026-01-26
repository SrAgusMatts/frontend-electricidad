import React from 'react';
import Link from "next/link";
import { Producto } from '@/types';

interface ProductProps {
  producto: Producto;
}

export default function ProductCard({ producto }: ProductProps) {
  return (
    <div className="card">
      
      <div className="card-image-container">
        <img 
          src={producto.imagenUrl} 
          alt={producto.nombre}
          className="card-image"
        />
      </div>

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
          <Link href={`/productos/${producto.id}`} className="btn-primary">
            Ver más
          </Link>
        </div>
      </div>
    </div>
  );
}