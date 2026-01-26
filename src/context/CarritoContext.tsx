"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
// Importamos CartItem y Producto desde types para no duplicar código
import { Producto, CartItem } from "@/types";

interface CarritoContextType {
  carrito: CartItem[];
  agregarItem: (producto: Producto, cantidad: number) => void;
  removerItem: (productoId: number) => void;
  limpiarCarrito: () => void;
  total: number;
  cantidadTotal: number;
}

const CarritoContext = createContext<CarritoContextType | undefined>(undefined);

export function CarritoProvider({ children }: { children: ReactNode }) {
  const [carrito, setCarrito] = useState<CartItem[]>([]);

  // Recuperar del LocalStorage al iniciar
  useEffect(() => {
    const carritoGuardado = localStorage.getItem("carrito_mattos");
    if (carritoGuardado) {
      try {
        setCarrito(JSON.parse(carritoGuardado));
      } catch (error) {
        console.error("Error al recuperar carrito:", error);
        localStorage.removeItem("carrito_mattos");
      }
    }
  }, []);

  // Guardar en LocalStorage al cambiar
  useEffect(() => {
    localStorage.setItem("carrito_mattos", JSON.stringify(carrito));
  }, [carrito]);

  const agregarItem = (producto: Producto, cantidad: number) => {
    setCarrito((prev) => {
      const existe = prev.find((item) => item.producto.id === producto.id);
      
      if (existe) {
        return prev.map((item) =>
          item.producto.id === producto.id
            ? { ...item, cantidad: item.cantidad + cantidad }
            : item
        );
      } else {
        return [...prev, { producto, cantidad }];
      }
    });
  };

  const removerItem = (productoId: number) => {
    setCarrito((prev) => prev.filter((item) => item.producto.id !== productoId));
  };

  const limpiarCarrito = () => {
    setCarrito([]);
  };

  const total = carrito.reduce((acc, item) => acc + (item.producto.precio * item.cantidad), 0);
  const cantidadTotal = carrito.reduce((acc, item) => acc + item.cantidad, 0);

  return (
    <CarritoContext.Provider value={{ 
      carrito, 
      agregarItem, 
      removerItem, 
      limpiarCarrito, 
      total,
      cantidadTotal 
    }}>
      {children}
    </CarritoContext.Provider>
  );
}

export function useCarrito() {
  const context = useContext(CarritoContext);
  if (context === undefined) {
    throw new Error("useCarrito debe usarse dentro de un CarritoProvider");
  }
  return context;
}