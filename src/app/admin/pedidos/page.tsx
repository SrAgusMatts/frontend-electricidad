"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { HiArrowLeft, HiEye, HiCalendar, HiCurrencyDollar, HiSearch, HiRefresh } from "react-icons/hi";
import Navbar from "@/components/Navbar";
import { Pedido } from "@/types";
import { obtenerPedido } from "@/services/api";

export default function AdminPedidos() {
    const [pedidos, setPedidos] = useState<Pedido[]>([]);
    const [loading, setLoading] = useState(true);

    // 👇 1. ESTADOS DE LOS INPUTS (Lo que el usuario escribe/selecciona)
    const [inputBusqueda, setInputBusqueda] = useState("");
    const [inputEstado, setInputEstado] = useState<"Todos" | "Pendiente" | "Completado" | "Cancelado">("Todos");
    const [inputFecha, setInputFecha] = useState("");

    // 👇 2. ESTADOS DE FILTROS APLICADOS (Lo que realmente usa la tabla)
    const [filtrosAplicados, setFiltrosAplicados] = useState({
        busqueda: "",
        estado: "Todos" as "Todos" | "Pendiente" | "Completado" | "Cancelado",
        fecha: ""
    });

    useEffect(() => {
        cargarPedidos();
    }, []);

    const cargarPedidos = async () => {
        setLoading(true);
        try {
            const data = await obtenerPedido(); 
            setPedidos(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // 👇 3. FUNCIÓN DEL BOTÓN "ACTUALIZAR"
    const ejecutarBusqueda = async () => {
        // Opcional: Recargamos datos del servidor para asegurar que vemos lo último
        await cargarPedidos();

        // "Congelamos" los valores de los inputs en los filtros aplicados
        setFiltrosAplicados({
            busqueda: inputBusqueda,
            estado: inputEstado,
            fecha: inputFecha
        });
    };

    // 👇 4. LÓGICA DE FILTRADO (Usa filtrosAplicados, NO los inputs directos)
    const pedidosFiltrados = pedidos.filter(p => {
        // A. Filtro por Estado
        const coincideEstado = filtrosAplicados.estado === "Todos" || p.estado === filtrosAplicados.estado;
        
        // B. Filtro por Texto
        const texto = filtrosAplicados.busqueda.toLowerCase();
        const coincideTexto = p.nombreCliente.toLowerCase().includes(texto) || p.id.toString().includes(texto);

        // C. Filtro por Fecha
        let coincideFecha = true;
        if (filtrosAplicados.fecha) {
            const fechaPedido = new Date(p.fecha).toISOString().split('T')[0];
            coincideFecha = fechaPedido === filtrosAplicados.fecha;
        }

        return coincideEstado && coincideTexto && coincideFecha;
    });

    const formatearFecha = (fechaIso: string) => {
        const fecha = new Date(fechaIso);
        return {
            dia: fecha.toLocaleDateString("es-AR"),
            hora: fecha.toLocaleTimeString("es-AR", { hour: '2-digit', minute: '2-digit' })
        };
    };

    return (
        <div className="page-wrapper bg-gray-50">
            <Navbar />
            <main className="max-w-7xl mx-auto py-8 px-4 w-full">
                
                <div className="flex items-center gap-4 mb-6">
                    <Link href="/admin/panel" className="text-gray-500 hover:text-blue-600 transition-colors">
                        <HiArrowLeft className="text-3xl" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 border-l-4 border-blue-600 pl-3">
                            Gestión de Pedidos
                        </h1>
                    </div>
                </div>

                {/* BARRA DE FILTROS */}
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
                    <div className="flex flex-col lg:flex-row gap-4 items-end">
                        
                        {/* Input: Cliente o ID */}
                        <div className="w-full lg:flex-1">
                            <label className="block text-xs font-bold text-gray-500 mb-1 ml-1">Buscar Cliente o ID</label>
                            <div className="relative">
                                <input 
                                    type="text" 
                                    placeholder="Ej: Sargento Naval..." 
                                    value={inputBusqueda}
                                    onChange={(e) => setInputBusqueda(e.target.value)}
                                    className="w-full border border-gray-300 rounded-md py-2 px-3 pl-10 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                />
                                <HiSearch className="absolute left-3 top-2.5 text-gray-400 text-lg" />
                            </div>
                        </div>

                        {/* Select: Estado */}
                        <div className="w-full lg:w-48">
                            <label className="block text-xs font-bold text-gray-500 mb-1 ml-1">Estado</label>
                            <select 
                                value={inputEstado}
                                onChange={(e) => setInputEstado(e.target.value as any)}
                                className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white cursor-pointer"
                            >
                                <option value="Todos">Todos</option>
                                <option value="Pendiente">Pendiente</option>
                                <option value="Completado">Completado</option>
                                <option value="Cancelado">Cancelado</option>
                            </select>
                        </div>

                        {/* Input: Fecha */}
                        <div className="w-full lg:w-48">
                            <label className="block text-xs font-bold text-gray-500 mb-1 ml-1">Fecha</label>
                            <input 
                                type="date" 
                                value={inputFecha}
                                onChange={(e) => setInputFecha(e.target.value)}
                                className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none text-gray-600"
                            />
                        </div>

                        {/* Botón: Buscar / Refrescar */}
                        <div className="w-full lg:w-auto">
                            <button 
                                onClick={ejecutarBusqueda}
                                className="w-full lg:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-md transition-colors flex items-center justify-center gap-2 shadow-sm h-[38px]"
                            >
                                <HiRefresh className="text-lg" />
                                <span>Actualizar</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* TABLA DE RESULTADOS */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider w-24">ID</th>
                                    <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Fecha</th>
                                    <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Cliente</th>
                                    <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Estado</th>
                                    <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Total</th>
                                    <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider text-center w-20">Ver</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {loading ? (
                                    <tr><td colSpan={6} className="p-12 text-center text-gray-500 italic">Cargando pedidos...</td></tr>
                                ) : pedidosFiltrados.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="p-12 text-center text-gray-500 bg-gray-50">
                                            No se encontraron pedidos con estos filtros.
                                        </td>
                                    </tr>
                                ) : (
                                    pedidosFiltrados.map((p) => {
                                        const { dia, hora } = formatearFecha(p.fecha);
                                        return (
                                            <tr key={p.id} className="hover:bg-blue-50/30 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500">#{p.id}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex flex-col text-sm">
                                                        <span className="font-medium text-gray-700 flex items-center gap-1">
                                                            <HiCalendar className="text-gray-400" /> {dia}
                                                        </span>
                                                        <span className="text-xs text-gray-400 ml-5">{hora} hs</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {p.nombreCliente}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border capitalize
                                                        ${p.estado === 'Pendiente' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : 
                                                          p.estado === 'Completado' ? 'bg-green-50 text-green-700 border-green-200' : 
                                                          'bg-red-50 text-red-700 border-red-200'}`}>
                                                        {p.estado}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-bold text-gray-900">
                                                    <div className="cell-total">
                                                        <HiCurrencyDollar className="text-green-400" />
                                                        {p.total.toLocaleString()}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                                    <Link href={`/admin/pedidos/${p.id}`} className="text-blue-600 hover:text-blue-900 hover:bg-blue-50 p-2 rounded-full inline-block transition-colors">
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
                </div>
            </main>
        </div>
    );
}