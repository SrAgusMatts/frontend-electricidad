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
// DTOs PEDIDOS (Carrito y Compras)
// ==========================================

// Un ítem individual dentro del carrito / orden
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
// TIPOS DEL FRONTEND (Estado local)
// ==========================================

// El ítem como lo guardamos en el Contexto/LocalStorage
export interface CartItem {
    producto: Producto;
    cantidad: number;
}