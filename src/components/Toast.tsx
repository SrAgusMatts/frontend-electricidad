import React, { useEffect } from 'react';
// Importamos iconos para que quede más lindo
import { HiCheckCircle, HiXCircle } from "react-icons/hi";

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  show: boolean;
  onClose: () => void;
}

export default function Toast({ message, type, show, onClose }: ToastProps) {
  
  // Efecto para que desaparezca solo a los 3 segundos
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  // Elegimos la clase de color según el tipo (usando las clases de globals.css)
  const colorClass = type === 'success' ? 'toast-success' : 'toast-error';
  const visibilityClass = show ? 'toast-visible' : 'toast-hidden';
  const Icon = type === 'success' ? HiCheckCircle : HiXCircle;

  return (
    <div className={`toast-base ${colorClass} ${visibilityClass}`}>
      <Icon className="text-2xl mr-3" />
      <span>{message}</span>
    </div>
  );
}