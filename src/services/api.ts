
const API_URL = "https://localhost:7081/api";

export interface Producto {
    id: number;
    nombre: string;
    descripcion: string;
    precio: number;
    imagenUrl: string;
    stock: number;
    categoriaId?: number;
    categoria?: { nombre: string };
    marca?: Marca;
}

export interface Marca {
    id: number;
    nombre: string;
}

const PUERTO = 7081;

export async function obtenerProductos(): Promise<Producto[]> {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

    try {
        const res = await fetch(`${API_URL}/Productos`, {
            cache: 'no-store'
        });

        if (!res.ok) {
            throw new Error(`Error HTTP: ${res.status}`);
        }

        return await res.json();
    } catch (error) {
        console.error("Error en el servicio obtenerProductos:", error);
        return [];
    }
}

export async function obtenerProductoPorId(id: number) {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

    try {
        const res = await fetch(`https://localhost:${PUERTO}/api/Productos/${id}`, {
            cache: 'no-store'
        });

        if (!res.ok) throw new Error("Producto no encontrado");

        return await res.json();
    } catch (error) {
        console.error("Error en el servicio obtenerProductos:", error);
        return [];
    }
}

export async function crearMarca(nombre: string): Promise<Marca> {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

    const res = await fetch(`https://localhost:${PUERTO}/api/Marcas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre }),
    });

    if (!res.ok) throw new Error("Error al crear marca");
    return await res.json();
}

export async function obtenerMarcas(): Promise<Marca[]> {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

    const res = await fetch(`https://localhost:${PUERTO}/api/Marcas`);
    if (!res.ok) throw new Error("Error al cargar marcas");

    return await res.json();
}

export async function registrarUsuario(datos: any) {
    const API_URL = `https://localhost:${PUERTO}/api/Usuarios/registro`;

    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

    try {
        const res = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(datos),
        });

        if (!res.ok) {
            const mensajeError = await res.text();
            throw new Error(mensajeError);
        }

        return await res.json();
    } catch (error) {
        throw error;
    }
}

export async function loginUsuario(datos: any) {
    const API_URL = `https://localhost:${PUERTO}/api/Usuarios/login`;

    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

    try {
        const res = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(datos),
        });

        if (!res.ok) {
            throw new Error("Correo o contraseña incorrectos");
        }

        return await res.json();
    } catch (error) {
        throw error;
    }
}

export async function crearProducto(datos: FormData) {
    const API_URL = `https://localhost:${PUERTO}/api/Productos`;

    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

    try {
        const res = await fetch(API_URL, {
            method: 'POST',
            body: datos,
        });

        if (!res.ok) {
            const errorText = await res.text();
            throw new Error(errorText || "Error al crear el producto");
        }

        return await res.json();
    } catch (error) {
        throw error;
    }
}

export async function eliminarProducto(id: number) {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

    await fetch(`https://localhost:${PUERTO}/api/Productos/${id}`, {
        method: 'DELETE',
    });
}

export async function actualizarProducto(id: number, producto: any) {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

    const res = await fetch(`https://localhost:${PUERTO}/api/Productos/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...producto, id }),
    });

    if (!res.ok) throw new Error("Error al actualizar");
}