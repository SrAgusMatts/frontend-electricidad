import React, { useEffect } from 'react';
import { HiCheckCircle, HiXCircle } from "react-icons/hi";

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  show: boolean;
  onClose: () => void;
}

export default function Toast({ message, type, show, onClose }: ToastProps) {
  
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

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