"use client";

import { useState, useEffect, useRef } from "react";
import { HiChevronDown, HiCheck, HiPlus } from "react-icons/hi";
import { crearMarca } from "@/services/api";
import { Marca } from "@/types";
import Toast from "./Toast";
import { debug } from "console";

interface Props {
    marcas: Marca[];
    marcaSeleccionadaId: number | "";
    onSeleccionar: (id: number) => void;
    onNuevaMarcaCreada: (marca: Marca) => void;
}

export default function SelectorMarca({ marcas, marcaSeleccionadaId, onSeleccionar, onNuevaMarcaCreada }: Props) {
    const mostrarNotificacion = (message: string, type: "success" | "error") => {
        setToast({ show: true, message, type });
    };
    const [toast, setToast] = useState({ show: false, message: "", type: "success" as "success" | "error" });
    const [busqueda, setBusqueda] = useState("");
    const [abierto, setAbierto] = useState(false);
    const [creando, setCreando] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (marcaSeleccionadaId) {
            const encontrada = marcas.find(m => m.id === marcaSeleccionadaId);
            if (encontrada) setBusqueda(encontrada.nombre);
        }
    }, [marcaSeleccionadaId, marcas]);

    useEffect(() => {
        function handleClickOutside(event: any) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setAbierto(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const marcasFiltradas = busqueda === ""
        ? marcas
        : marcas.filter((m) => m.nombre.toLowerCase().includes(busqueda.toLowerCase()));

    const handleCrear = async () => {
        debugger
        if (!busqueda.trim()) return;
        setCreando(true);
        try {
            const nueva = await crearMarca(busqueda);
            onNuevaMarcaCreada(nueva);
            onSeleccionar(nueva.id);
            setAbierto(false);
        } catch (error) {
            mostrarNotificacion("Error al crear la marca.", "error");
        } finally {
            setCreando(false);
        }
    };

    return (
        <div className="combo-container" ref={wrapperRef}>

            <Toast
                show={toast.show}
                message={toast.message}
                type={toast.type}
                onClose={() => setToast({ ...toast, show: false })}
            />

            <div className="combo-trigger" onClick={() => setAbierto(true)}>
                <input
                    type="text"
                    className="combo-input"
                    placeholder="Seleccionar o escribir nueva..."
                    value={busqueda}
                    onChange={(e) => {
                        setBusqueda(e.target.value);
                        setAbierto(true);
                        if (e.target.value === "") onSeleccionar(0);
                    }}
                    onFocus={() => setAbierto(true)}
                />
                <HiChevronDown className={`text-gray-400 transition-transform ${abierto ? "rotate-180" : ""}`} />
            </div>

            {/* Dropdown */}
            {abierto && (
                <ul className="combo-dropdown">

                    {marcasFiltradas.map((marca) => (
                        <li
                            key={marca.id}
                            className={`combo-item ${marca.id === marcaSeleccionadaId ? "selected" : ""}`}
                            onClick={() => {
                                onSeleccionar(marca.id);
                                setBusqueda(marca.nombre);
                                setAbierto(false);
                            }}
                        >
                            {marca.nombre}
                            {marca.id === marcaSeleccionadaId && <HiCheck />}
                        </li>
                    ))}

                    {marcasFiltradas.length === 0 && busqueda.trim() !== "" && (
                        <li>
                            <button
                                type="button"
                                className="combo-create-btn"
                                onClick={handleCrear}
                                disabled={creando}
                            >
                                <div className="bg-blue-100 p-1 rounded-full">
                                    <HiPlus className="text-blue-600" />
                                </div>
                                <span>
                                    {creando ? "Guardando..." : `Crear "${busqueda}"`}
                                </span>
                            </button>
                        </li>
                    )}

                    {marcasFiltradas.length === 0 && busqueda.trim() === "" && (
                        <li className="px-4 py-3 text-gray-400 text-xs text-center">Empezá a escribir...</li>
                    )}
                </ul>
            )}
        </div>
    );
}