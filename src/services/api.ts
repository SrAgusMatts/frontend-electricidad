import { 
    Producto, 
    Marca, 
    PedidoCreateDto, 
    PedidoResponse 
} from "@/types";

const PUERTO = 7081;
const API_URL = `https://localhost:${PUERTO}/api`;

const ignoreSSL = () => {
    if (typeof process !== 'undefined' && process.env) {
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    }
};

// ==========================================
// PRODUCTOS
// ==========================================

export async function obtenerProductos(): Promise<Producto[]> {
    ignoreSSL();
    try {
        const res = await fetch(`${API_URL}/Productos`, { cache: 'no-store' });
        if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);
        return await res.json();
    } catch (error) {
        console.error("Error en obtenerProductos:", error);
        return [];
    }
}

export async function obtenerProductoPorId(id: number): Promise<Producto> {
    ignoreSSL();
    const res = await fetch(`${API_URL}/Productos/${id}`, { cache: 'no-store' });
    if (!res.ok) throw new Error("Producto no encontrado");
    return await res.json();
}

export async function crearProducto(datos: FormData): Promise<Producto> {
    ignoreSSL();
    const res = await fetch(`${API_URL}/Productos`, {
        method: 'POST',
        body: datos, // FormData se encarga de los headers
    });

    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Error al crear el producto");
    }
    return await res.json();
}

export async function actualizarProducto(id: number, datos: FormData): Promise<void> {
    ignoreSSL();
    const res = await fetch(`${API_URL}/Productos/${id}`, {
        method: 'PUT',
        body: datos,
    });
    if (!res.ok) throw new Error("Error al actualizar");
}

export async function eliminarProducto(id: number): Promise<void> {
    ignoreSSL();
    await fetch(`${API_URL}/Productos/${id}`, { method: 'DELETE' });
}

// ==========================================
// MARCAS
// ==========================================

export async function obtenerMarcas(): Promise<Marca[]> {
    ignoreSSL();
    const res = await fetch(`${API_URL}/Marcas`);
    if (!res.ok) throw new Error("Error al cargar marcas");
    return await res.json();
}

export async function crearMarca(nombre: string): Promise<Marca> {
    ignoreSSL();
    const res = await fetch(`${API_URL}/Marcas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre }),
    });

    if (!res.ok) throw new Error("Error al crear marca");
    return await res.json();
}

// ==========================================
// USUARIOS (Auth)
// ==========================================

export async function registrarUsuario(datos: any) {
    ignoreSSL();
    const res = await fetch(`${API_URL}/Usuarios/registro`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos),
    });

    if (!res.ok) {
        const mensajeError = await res.text();
        throw new Error(mensajeError);
    }
    return await res.json();
}

export async function loginUsuario(datos: any) {
    ignoreSSL();
    const res = await fetch(`${API_URL}/Usuarios/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos),
    });

    if (!res.ok) throw new Error("Correo o contraseña incorrectos");
    return await res.json();
}

// ==========================================
// PEDIDOS (NUEVO) 🛒
// ==========================================

export const crearPedido = async (pedido: PedidoCreateDto): Promise<PedidoResponse> => {
    ignoreSSL();
    const res = await fetch(`${API_URL}/Pedidos`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(pedido),
    });

    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Error al crear el pedido");
    }

    return await res.json();
};