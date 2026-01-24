// Definimos la URL base aquí para no repetirla
// OJO: Acordate de revisar que el puerto sea el correcto (7152 o el que tengas)
const API_URL = "https://localhost:7081/api";

// Definimos la interfaz aquí para poder reutilizarla en otros lados
export interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  imagenUrl: string;
  stock: number;
  categoria?: { nombre: string };
}

export async function obtenerProductos(): Promise<Producto[]> {
  // Esto arregla el error de certificado local (solo para desarrollo)
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

  try {
    const res = await fetch(`${API_URL}/Productos`, { 
      cache: 'no-store' // Datos siempre frescos
    });

    if (!res.ok) {
      throw new Error(`Error HTTP: ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    console.error("Error en el servicio obtenerProductos:", error);
    return []; // Retornamos array vacío para que no explote la UI
  }
}