// import {
//     Producto,
//     Marca,
//     PedidoCreateDto,
//     PedidoResponse,
//     Pedido
// } from "@/types";

// const PUERTO = 7081;
// const API_URL = `https://localhost:${PUERTO}/api`;

// const ignoreSSL = () => {
//     if (typeof process !== 'undefined' && process.env) {
//         process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
//     }
// };

// // ==========================================
// // PRODUCTOS
// // ==========================================

// export async function obtenerProductos(): Promise<Producto[]> {
//     ignoreSSL();
//     try {
//         const res = await fetch(`${API_URL}/Productos`, { cache: 'no-store' });
//         if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);
//         return await res.json();
//     } catch (error) {
//         console.error("Error en obtenerProductos:", error);
//         return [];
//     }
// }

// export async function obtenerProductoPorId(id: number): Promise<Producto> {
//     ignoreSSL();
//     const res = await fetch(`${API_URL}/Productos/${id}`, { cache: 'no-store' });
//     if (!res.ok) throw new Error("Producto no encontrado");
//     return await res.json();
// }

// export async function crearProducto(datos: FormData): Promise<Producto> {
//     ignoreSSL();
//     const res = await fetch(`${API_URL}/Productos`, {
//         method: 'POST',
//         body: datos, // FormData se encarga de los headers
//     });

//     if (!res.ok) {
//         const errorText = await res.text();
//         throw new Error(errorText || "Error al crear el producto");
//     }
//     return await res.json();
// }

// export async function actualizarProducto(id: number, datos: FormData): Promise<void> {
//     ignoreSSL();
//     const res = await fetch(`${API_URL}/Productos/${id}`, {
//         method: 'PUT',
//         body: datos,
//     });
//     if (!res.ok) throw new Error("Error al actualizar");
// }

// export async function eliminarProducto(id: number): Promise<void> {
//     ignoreSSL();
//     await fetch(`${API_URL}/Productos/${id}`, { method: 'DELETE' });
// }

// // ==========================================
// // MARCAS
// // ==========================================

// export async function obtenerMarcas(): Promise<Marca[]> {
//     ignoreSSL();
//     const res = await fetch(`${API_URL}/Marcas`);
//     if (!res.ok) throw new Error("Error al cargar marcas");
//     return await res.json();
// }

// export async function crearMarca(nombre: string): Promise<Marca> {

//     const token = localStorage.getItem("token");

//     if (!token) {
//         throw new Error("No hay sesión activa. Por favor, iniciá sesión de nuevo.");
//     }

//     const res = await fetch(`${API_URL}/Marcas`, {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//             // 👇 ESTO ES EL PASE VIP. SI LO SACÁS, NO ENTRÁS.
//             'Authorization': `Bearer ${token}` 
//         },
//         body: JSON.stringify({ nombre: nombre }),
//     });

//     if (!res.ok) {
//         // Intentamos leer el error, si falla usamos uno genérico
//         const textoError = await res.text().catch(() => null);
//         throw new Error(textoError || "Error al crear marca");
//     }

//     return await res.json();
// }

// // ==========================================
// // USUARIOS (Auth)
// // ==========================================

// export async function registrarUsuario(datos: any) {
//     ignoreSSL();
//     const res = await fetch(`${API_URL}/Usuarios/registro`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(datos),
//     });

//     if (!res.ok) {
//         const mensajeError = await res.text();
//         throw new Error(mensajeError);
//     }
//     return await res.json();
// }

// export async function loginUsuario(datos: any) {
//     ignoreSSL();
//     const res = await fetch(`${API_URL}/Usuarios/login`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(datos),
//     });

//     if (!res.ok) throw new Error("Correo o contraseña incorrectos");
//     return await res.json();
// }

// export const solicitarRecuperacion = async (email: string): Promise<boolean> => {
//     try {
//         const res = await fetch(`${API_URL}/Auth/olvide-password`, {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ email }),
//         });

//         // Devolvemos true si salió bien (200 OK), false si falló
//         return res.ok;
//     } catch (error) {
//         console.error("Error en solicitarRecuperacion:", error);
//         throw error; // Relanzamos para que el componente sepa que hubo error de red
//     }
// }

// export const restablecerPassword = async (email: string, token: string, nuevaPassword: string) => {
//     try {
//         const res = await fetch(`${API_URL}/Auth/reset-password`, {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ email, token, nuevaPassword }),
//         });

//         const data = await res.json();
//         return { ok: res.ok, message: data.message };
//     } catch (error) {
//         console.error("Error en restablecerPassword:", error);
//         throw error;
//     }
// }

// // ==========================================
// // PEDIDOS (NUEVO) 🛒
// // ==========================================

// export const crearPedido = async (pedido: PedidoCreateDto): Promise<PedidoResponse> => {
//     ignoreSSL();
//     const res = await fetch(`${API_URL}/Pedidos`, {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//         },
//         body: JSON.stringify(pedido),
//     });

//     if (!res.ok) {
//         const errorText = await res.text();
//         throw new Error(errorText || "Error al crear el pedido");
//     }

//     return await res.json();
// };

// export async function obtenerPedido(): Promise<Pedido[]> {
//     ignoreSSL();
//     const res = await fetch(`${API_URL}/Pedidos`);

//     if (!res.ok) {
//         throw new Error("Error al cargar pedidos");
//     }

//     return await res.json();
// }

// export async function obtenerPedidoPorId(id: number): Promise<Pedido> {
//     ignoreSSL();
//     const res = await fetch(`${API_URL}/Pedidos/${id}`);
//     if (!res.ok) throw new Error("Pedido no encontrado");
//     return await res.json();
// }

// export async function actualizarEstadoPedido(id: number, nuevoEstado: string): Promise<void> {
//     ignoreSSL();
//     const res = await fetch(`${API_URL}/Pedidos/${id}/estado`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         // 👇 AHORA ENVIAMOS UN OBJETO JSON
//         body: JSON.stringify({ estado: nuevoEstado })
//     });

//     if (!res.ok) {
//         // Log para ver qué pasó si falla
//         console.error(await res.text());
//         throw new Error("Error al actualizar estado");
//     }
// }

import {
    Producto,
    Marca,
    PedidoCreateDto,
    PedidoResponse,
    Pedido
} from "@/types";

// 👇 CAMBIO: Usamos variable de entorno si existe, sino localhost
const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://localhost:7081/api";

// 🛠️ HELPER: Función para obtener el token y armar el header
// Esto nos ahorra escribir el if (!token) en cada función
const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    if (!token) {
        throw new Error("No hay sesión activa. Por favor, iniciá sesión.");
    }
    return {
        'Authorization': `Bearer ${token}`,
        // Nota: No agregamos 'Content-Type' aquí porque FormData no lo necesita
    };
};

// ==========================================
// 📦 PRODUCTOS
// ==========================================

// ✅ PÚBLICO
export async function obtenerProductos(): Promise<Producto[]> {
    try {
        const res = await fetch(`${API_URL}/Productos`, { cache: 'no-store' });
        if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);
        return await res.json();
    } catch (error) {
        console.error("Error en obtenerProductos:", error);
        return [];
    }
}

// ✅ PÚBLICO
export async function obtenerProductoPorId(id: number): Promise<Producto> {
    const res = await fetch(`${API_URL}/Productos/${id}`, { cache: 'no-store' });
    if (!res.ok) throw new Error("Producto no encontrado");
    return await res.json();
}

// 🔒 PROTEGIDO (ADMIN)
export async function crearProducto(datos: FormData): Promise<Producto> {
    const headers = getAuthHeaders(); // Recuperamos token

    const res = await fetch(`${API_URL}/Productos`, {
        method: 'POST',
        headers: {
            ...headers,
            // ⚠️ OJO: Con FormData NO se pone 'Content-Type': 'application/json'
            // El navegador lo pone solo con el "boundary" correcto.
        },
        body: datos,
    });

    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Error al crear el producto");
    }
    return await res.json();
}

// 🔒 PROTEGIDO (ADMIN)
export async function actualizarProducto(id: number, datos: FormData): Promise<void> {
    const headers = getAuthHeaders();

    const res = await fetch(`${API_URL}/Productos/${id}`, {
        method: 'PUT',
        headers: { ...headers }, // Solo Authorization
        body: datos,
    });
    if (!res.ok) throw new Error("Error al actualizar");
}

// 🔒 PROTEGIDO (ADMIN)
export async function eliminarProducto(id: number): Promise<void> {
    const headers = getAuthHeaders();

    await fetch(`${API_URL}/Productos/${id}`, {
        method: 'DELETE',
        headers: { ...headers }
    });
}

// ==========================================
// 🏷️ MARCAS
// ==========================================

// ✅ PÚBLICO (Normalmente se usa para filtrar)
export async function obtenerMarcas(): Promise<Marca[]> {
    const res = await fetch(`${API_URL}/Marcas`);
    if (!res.ok) throw new Error("Error al cargar marcas");
    return await res.json();
}

// 🔒 PROTEGIDO (ADMIN)
export async function crearMarca(nombre: string): Promise<Marca> {
    const headers = getAuthHeaders();

    const res = await fetch(`${API_URL}/Marcas`, {
        method: 'POST',
        headers: {
            ...headers,
            'Content-Type': 'application/json', // Acá sí va JSON
        },
        body: JSON.stringify({ nombre: nombre }),
    });

    if (!res.ok) {
        const textoError = await res.text().catch(() => null);
        throw new Error(textoError || "Error al crear marca");
    }

    return await res.json();
}

// ==========================================
// 👤 USUARIOS (Auth)
// ==========================================

// ✅ PÚBLICO
export async function registrarUsuario(datos: any) {
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

// ✅ PÚBLICO
export async function loginUsuario(datos: any) {
    const res = await fetch(`${API_URL}/Usuarios/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos),
    });

    if (!res.ok) throw new Error("Correo o contraseña incorrectos");
    return await res.json();
}

// ✅ PÚBLICO
export const solicitarRecuperacion = async (email: string): Promise<boolean> => {
    try {
        const res = await fetch(`${API_URL}/Auth/olvide-password`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
        });
        return res.ok;
    } catch (error) {
        console.error("Error en solicitarRecuperacion:", error);
        throw error;
    }
}

// ✅ PÚBLICO
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
// 🛒 PEDIDOS
// ==========================================

// 🔒 PROTEGIDO (CLIENTE)
export const crearPedido = async (pedido: PedidoCreateDto): Promise<PedidoResponse> => {
    const headers = getAuthHeaders();

    const res = await fetch(`${API_URL}/Pedidos`, {
        method: "POST",
        headers: {
            ...headers,
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

// 🔒 PROTEGIDO (VER MIS PEDIDOS / ADMIN VER TODOS)
export async function obtenerPedido(): Promise<Pedido[]> {
    const headers = getAuthHeaders(); // Necesita saber quién sos

    const res = await fetch(`${API_URL}/Pedidos`, {
        headers: { ...headers }
    });

    if (!res.ok) {
        throw new Error("Error al cargar pedidos");
    }

    return await res.json();
}

// 🔒 PROTEGIDO
export async function obtenerPedidoPorId(id: number): Promise<Pedido> {
    const headers = getAuthHeaders();

    const res = await fetch(`${API_URL}/Pedidos/${id}`, {
        headers: { ...headers }
    });

    if (!res.ok) throw new Error("Pedido no encontrado");
    return await res.json();
}

// 🔒 PROTEGIDO (ADMIN)
export async function actualizarEstadoPedido(id: number, nuevoEstado: string): Promise<void> {
    const headers = getAuthHeaders();

    const res = await fetch(`${API_URL}/Pedidos/${id}/estado`, {
        method: "PUT",
        headers: {
            ...headers,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ estado: nuevoEstado })
    });

    if (!res.ok) {
        console.error(await res.text());
        throw new Error("Error al actualizar estado");
    }
}