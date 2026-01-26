// ==========================================
// ENTIDADES (Lo que viene de la BD)
// ==========================================

export interface Marca {
    id: number;
    nombre: string;
}

export interface Producto {
    id: number;
    nombre: string;
    descripcion: string;
    precio: number;
    stock: number;
    imagenUrl: string;
    categoriaId?: number;
    categoria?: { nombre: string };

    // Relación con Marca
    marca?: Marca;
    marcaId?: number;
}

// ==========================================
// DTOs PEDIDOS (Carrito y Creación)
// ==========================================

// Un ítem individual para enviar al crear
export interface DetallePedidoDto {
    productoId: number;
    cantidad: number;
}

// El formulario completo para crear el pedido
export interface PedidoCreateDto {
    nombreCliente: string;
    telefono: string;
    email: string;
    items: DetallePedidoDto[];
}

// Lo que responde el backend al crear el pedido
export interface PedidoResponse {
    mensaje: string;
    idPedido: number;
    total: number;
}

// ==========================================
// VISTA DE PEDIDOS (Panel Admin) - ¡NUEVO! 📦
// ==========================================

// El detalle de un pedido ya realizado (para ver)
export interface DetallePedido {
    productoId: number;
    nombreProducto: string;
    cantidad: number;
    precioUnitario: number;
    subtotal: number;
}

// El pedido completo que viene del Backend
export interface Pedido {
    id: number;
    fecha: string;
    estado: string;
    nombreCliente: string;
    telefono: string;
    email: string;
    total: number;
    items: DetallePedido[];
}

// ==========================================
// TIPOS DEL FRONTEND (Estado local)
// ==========================================

export interface CartItem {
    producto: Producto;
    cantidad: number;
}