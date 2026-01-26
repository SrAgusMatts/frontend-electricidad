"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { HiArrowLeft, HiCheck, HiPrinter, HiUser, HiMail, HiPhone } from "react-icons/hi";
import Navbar from "@/components/Navbar";
import Toast from "@/components/Toast";
import { Pedido } from "@/types";
import { obtenerPedidoPorId, actualizarEstadoPedido } from "@/services/api";

export default function DetallePedidoPage() {
    const params = useParams();
    const [pedido, setPedido] = useState<Pedido | null>(null);
    const [loading, setLoading] = useState(true);
    const [procesando, setProcesando] = useState(false);
    const [toast, setToast] = useState({ show: false, message: "", type: "success" as "success" | "error" });

    const pedidoId = params?.id ? Number(params.id) : 0;

    useEffect(() => {
        if (pedidoId) cargarDatos(pedidoId);
    }, [pedidoId]);

    const cargarDatos = async (id: number) => {
        try {
            const data = await obtenerPedidoPorId(id);
            setPedido(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleConfirmar = async () => {
        if (!pedido) return;
        if (!confirm("¿Marcar este pedido como COMPLETADO?")) return;

        setProcesando(true);
        try {
            await actualizarEstadoPedido(pedido.id, "Completado");
            setToast({ show: true, message: "Pedido actualizado a Completado", type: "success" });
            setPedido({ ...pedido, estado: "Completado" });
        } catch (error) {
            setToast({ show: true, message: "Error al actualizar", type: "error" });
        } finally {
            setProcesando(false);
        }
    };

    if (loading) return <div className="page-wrapper items-center justify-center"><div className="loading-spinner" /></div>;
    if (!pedido) return <div className="page-wrapper items-center justify-center">Pedido no encontrado</div>;

    const fecha = new Date(pedido.fecha);
    const dia = fecha.toLocaleDateString("es-AR");
    const hora = fecha.toLocaleTimeString("es-AR", { hour: '2-digit', minute: '2-digit' });

    return (
        <>
            {/* VISTA NORMAL DE PANTALLA (Se oculta al imprimir con la clase no-print) */}
            <div className="page-wrapper no-print">
                <Navbar />
                <Toast show={toast.show} message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, show: false })} />

                <main className="detail-page-container">
                    <div className="detail-header-wrapper">
                        <div className="detail-title-group">
                            <Link href="/admin/pedidos" className="btn-back">
                                <HiArrowLeft className="text-3xl" />
                            </Link>
                            <div>
                                <h1 className="detail-main-title">
                                    Pedido #{pedido.id}
                                    <span className={`badge-base ${pedido.estado === 'Pendiente' ? 'badge-pending' : 'badge-completed'}`}>
                                        {pedido.estado}
                                    </span>
                                </h1>
                                <p className="detail-date-sub">Realizado el {dia} a las {hora}</p>
                            </div>
                        </div>

                        <div className="detail-actions-group">
                            <button className="btn-print" onClick={() => window.print()}>
                                <HiPrinter /> Imprimir Comprobante
                            </button>

                            {pedido.estado === 'Pendiente' && (
                                <button onClick={handleConfirmar} disabled={procesando} className="btn-confirm-order">
                                    <HiCheck /> {procesando ? "Procesando..." : "Confirmar Pedido"}
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="detail-content-grid">
                        <div className="detail-section-left">
                            <div className="detail-card">
                                <div className="detail-card-header">Productos</div>
                                <table className="w-full text-left">
                                    <thead className="products-table-header">
                                        <tr>
                                            <th className="products-th">Item</th>
                                            <th className="products-th text-center">Cant.</th>
                                            <th className="products-th text-right">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {pedido.items.map((item, i) => (
                                            <tr key={i}>
                                                <td className="products-td-name">{item.nombreProducto}</td>
                                                <td className="products-td-center">{item.cantidad}</td>
                                                <td className="products-td-right">$ {item.subtotal.toLocaleString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot className="products-tfoot">
                                        <tr>
                                            <td colSpan={2} className="products-total-label">TOTAL:</td>
                                            <td className="products-total-value">$ {pedido.total.toLocaleString()}</td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="detail-card">
                                <div className="detail-card-header bg-white border-b-0 pb-0 pt-6">Datos del Cliente</div>
                                <div className="detail-card-body space-y-4">
                                    <div className="client-data-row">
                                        <HiUser className="text-gray-400 text-xl mt-0.5" />
                                        <div><p className="client-data-label">Nombre</p><p className="client-data-value">{pedido.nombreCliente}</p></div>
                                    </div>
                                    {pedido.email && (
                                        <div className="client-data-row">
                                            <HiMail className="text-gray-400 text-xl mt-0.5" />
                                            <div><p className="client-data-label">Email</p><p className="client-data-value break-all">{pedido.email}</p></div>
                                        </div>
                                    )}
                                    {pedido.telefono && (
                                        <div className="client-data-row">
                                            <HiPhone className="text-gray-400 text-xl mt-0.5" />
                                            <div><p className="client-data-label">Teléfono</p><p className="client-data-value">{pedido.telefono}</p></div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            {/* VISTA DE IMPRESIÓN (FACTURA) - Se muestra SOLO al imprimir */}
            <div className="printable-invoice">

                {/* ENCABEZADO TIPO FACTURA */}
                <div className="invoice-header-grid">
                    <div className="invoice-col-left">
                        <h2 className="text-xl font-bold uppercase">Electricidad Mattos</h2>
                        <p className="text-xs mt-1">Av. San Francisco 1234</p>
                        <p className="text-xs">San Francisco, Córdoba</p>
                        <p className="text-xs">Tel: (3564) 123-456</p>
                        <p className="text-xs">IVA RESPONSABLE INSCRIPTO</p>
                    </div>

                    <div className="invoice-col-center">
                        <div className="invoice-letter-box">X</div>
                        <span className="text-[10px] text-center uppercase">Documento no válido como factura</span>
                    </div>

                    <div className="invoice-col-right text-right">
                        <h3 className="font-bold text-lg">NOTA DE PEDIDO</h3>
                        <p className="font-mono text-sm">Nº: {pedido.id.toString().padStart(8, '0')}</p>
                        <p className="text-sm mt-2">FECHA: {dia}</p>
                        <p className="text-xs mt-2">CUIT: 20-12345678-9</p>
                        <p className="text-xs">Ing. Brutos: 904-123456</p>
                    </div>
                </div>

                {/* DATOS CLIENTE */}
                <div className="invoice-box">
                    <table className="w-full text-xs">
                        <tbody>
                            <tr>
                                <td className="font-bold w-20">Señor(es):</td>
                                <td className="uppercase">{pedido.nombreCliente}</td>
                            </tr>
                            <tr>
                                <td className="font-bold">Domicilio:</td>
                                <td>-</td>
                            </tr>
                            <tr>
                                <td className="font-bold">Teléfono:</td>
                                <td>{pedido.telefono || "-"}</td>
                                <td className="font-bold text-right w-20">Cond. Venta:</td>
                                <td className="text-right w-20">Contado</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* TABLA PRODUCTOS */}
                <table className="invoice-table">
                    <thead>
                        <tr>
                            <th className="w-16 text-center">COD</th>
                            <th className="w-10 text-center">CANT</th>
                            <th className="text-left">DETALLE / DESCRIPCIÓN</th>
                            <th className="w-24 text-right">P. UNITARIO</th>
                            <th className="w-24 text-right">IMPORTE</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pedido.items.map((item, i) => (
                            <tr key={i}>
                                <td className="text-center">{item.productoId}</td>
                                <td className="text-center">{item.cantidad}</td>
                                <td>{item.nombreProducto}</td>
                                <td className="text-right">$ {item.precioUnitario.toLocaleString("es-AR", { minimumFractionDigits: 2 })}</td>
                                <td className="text-right font-bold">$ {item.subtotal.toLocaleString("es-AR", { minimumFractionDigits: 2 })}</td>
                            </tr>
                        ))}

                        {[...Array(Math.max(0, 10 - pedido.items.length))].map((_, i) => (
                            <tr key={`fill-${i}`}>
                                <td className="text-center text-transparent">.</td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* TOTALES */}
                <div className="invoice-footer">
                    <table className="w-64 text-right text-sm">
                        <tbody>
                            <tr>
                                <td className="pr-4 font-bold">SUBTOTAL:</td>
                                <td>$ {pedido.total.toLocaleString("es-AR", { minimumFractionDigits: 2 })}</td>
                            </tr>
                            <tr>
                                <td className="pr-4 font-bold text-xl border-t border-black mt-2 pt-2">TOTAL:</td>
                                <td className="font-bold text-xl border-t border-black mt-2 pt-2">$ {pedido.total.toLocaleString("es-AR", { minimumFractionDigits: 2 })}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className="text-center text-[10px] mt-8 italic">
                    Gracias por su compra - Electricidad Mattos
                </div>
            </div>
        </>
    );
}