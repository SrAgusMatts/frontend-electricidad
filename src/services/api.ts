import {
    Producto,
    Marca,
    PedidoCreateDto,
    PedidoResponse,
    Pedido
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

    const token = localStorage.getItem("token");

    const res = await fetch(`${API_URL}/Marcas`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ nombre: nombre }),
    });

    if (!res.ok) {
        const textoError = await res.text();
        throw new Error(textoError || "Error al crear marca");
    }

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

export const solicitarRecuperacion = async (email: string): Promise<boolean> => {
    try {
        const res = await fetch(`${API_URL}/Auth/olvide-password`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
        });

        // Devolvemos true si salió bien (200 OK), false si falló
        return res.ok;
    } catch (error) {
        console.error("Error en solicitarRecuperacion:", error);
        throw error; // Relanzamos para que el componente sepa que hubo error de red
    }
}

export const restablecerPassword = async (email: string, token: string, nuevaPassword: string) => {
    try {
        const res = await fetch(`${API_URL}/Auth/reset-password`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, token, nuevaPassword }),
        });

        const data = await res.json();
        return { ok: res.ok, message: data.message };
    } catch (error) {
        console.error("Error en restablecerPassword:", error);
        throw error;
    }
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

export async function obtenerPedido(): Promise<Pedido[]> {
    ignoreSSL();
    const res = await fetch(`${API_URL}/Pedidos`);

    if (!res.ok) {
        throw new Error("Error al cargar pedidos");
    }

    return await res.json();
}

export async function obtenerPedidoPorId(id: number): Promise<Pedido> {
    ignoreSSL();
    const res = await fetch(`${API_URL}/Pedidos/${id}`);
    if (!res.ok) throw new Error("Pedido no encontrado");
    return await res.json();
}

export async function actualizarEstadoPedido(id: number, nuevoEstado: string): Promise<void> {
    ignoreSSL();
    const res = await fetch(`${API_URL}/Pedidos/${id}/estado`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        // 👇 AHORA ENVIAMOS UN OBJETO JSON
        body: JSON.stringify({ estado: nuevoEstado })
    });

    if (!res.ok) {
        // Log para ver qué pasó si falla
        console.error(await res.text());
        throw new Error("Error al actualizar estado");
    }
}