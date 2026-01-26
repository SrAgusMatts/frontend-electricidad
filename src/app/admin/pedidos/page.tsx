"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { HiArrowLeft, HiEye, HiCalendar, HiCurrencyDollar } from "react-icons/hi";
import Navbar from "@/components/Navbar";
import { Pedido } from "@/types";
import { obtenerPedido } from "@/services/api";

export default function AdminPedidos() {
    const [pedidos, setPedidos] = useState<Pedido[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        cargarPedidos();
    }, []);

    const cargarPedidos = async () => {
        try {
            const data = await obtenerPedido();
            setPedidos(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const formatearFecha = (fechaIso: string) => {
        const fecha = new Date(fechaIso);
        return {
            dia: fecha.toLocaleDateString("es-AR"),
            hora: fecha.toLocaleTimeString("es-AR", { hour: '2-digit', minute: '2-digit' })
        };
    };

    return (
        <div className="page-wrapper">
            <Navbar />
            <main className="admin-main-container">
                <div className="orders-header">
                    <Link href="/admin" className="btn-back">
                        <HiArrowLeft className="text-3xl" />
                    </Link>
                    <div>
                        <h1 className="page-title">Gestión de Pedidos</h1>
                    </div>
                </div>

                <div className="table-container">
                    <table className="admin-table">
                        <thead className="table-head">
                            <tr>
                                <th className="th-cell w-20">ID</th>
                                <th className="th-cell">Fecha</th>
                                <th className="th-cell">Cliente</th>
                                <th className="th-cell text-center">Estado</th>
                                <th className="th-cell text-right">Total</th>
                                <th className="th-cell text-center w-20">Ver</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {loading ? (
                                <tr><td colSpan={6} className="p-12 text-center text-gray-500">Cargando...</td></tr>
                            ) : pedidos.length === 0 ? (
                                <tr><td colSpan={6} className="empty-cell">Sin pedidos.</td></tr>
                            ) : (
                                pedidos.map((p) => {
                                    const { dia, hora } = formatearFecha(p.fecha);
                                    return (
                                        <tr key={p.id} className="tbody-row hover:bg-blue-50/40">
                                            <td className="td-cell cell-id">#{p.id}</td>
                                            <td className="td-cell">
                                                <div className="date-wrapper">
                                                    <span className="date-day"><HiCalendar className="text-gray-400" /> {dia}</span>
                                                    <span className="date-time">{hora} hs</span>
                                                </div>
                                            </td>
                                            <td className="td-cell cell-client">{p.nombreCliente}</td>
                                            <td className="td-cell text-center">
                                                <span className={`badge-base ${p.estado === 'Pendiente' ? 'badge-pending' : 'badge-completed'}`}>
                                                    {p.estado}
                                                </span>
                                            </td>
                                            <td className="td-cell text-right">
                                                <span className="cell-total">
                                                    <HiCurrencyDollar className="text-lg" /> {p.total.toLocaleString()}
                                                </span>
                                            </td>
                                            <td className="td-cell text-center">
                                                {/* 👇 AHORA ES UN LINK A LA PÁGINA DE DETALLE */}
                                                <Link href={`/admin/pedidos/${p.id}`} className="btn-view-details inline-block">
                                                    <HiEye className="text-xl" />
                                                </Link>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
}