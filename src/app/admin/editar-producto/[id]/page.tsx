"use client";

import { useEffect, useState, FormEvent } from "react";
import { useRouter, useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import {
  obtenerProductoPorId,
  actualizarProducto,
  obtenerMarcas,
  Marca
} from "@/services/api";
import SelectorMarca from "@/components/SelectorMarca";

export default function EditarProductoPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);

  // Estados
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState("");
  const [stock, setStock] = useState("");
  const [categoriaId, setCategoriaId] = useState<number>(1);
  const [imagenActual, setImagenActual] = useState("");
  const [nuevaImagen, setNuevaImagen] = useState<File | null>(null);

  // Estados Marca
  const [marcasDisponibles, setMarcasDisponibles] = useState<Marca[]>([]);
  const [marcaId, setMarcaId] = useState<number | "">("");

  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    cargarDatos();
  }, [id]);

  const cargarDatos = async () => {
    try {
      const [producto, marcas] = await Promise.all([
        obtenerProductoPorId(id),
        obtenerMarcas()
      ]);

      if (producto) {
        setNombre(producto.nombre);
        setDescripcion(producto.descripcion);
        setPrecio(producto.precio.toString());
        setStock(producto.stock.toString());
        setCategoriaId(producto.categoriaId);
        setImagenActual(producto.imagenUrl);

        if (producto.marca) {
          setMarcaId(producto.marca.id);
        } else if (producto.marcaId) {
          setMarcaId(producto.marcaId);
        }
      }
      setMarcasDisponibles(marcas);
    } catch (error) {
      console.error("Error cargando datos:", error);
      alert("Error al cargar producto");
      router.push("/admin");
    } finally {
      setLoading(false);
    }
  };

  const handleNuevaMarca = (nueva: Marca) => {
    setMarcasDisponibles([...marcasDisponibles, nueva]);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setGuardando(true);

    try {
      const formData = new FormData();
      formData.append("Nombre", nombre);
      formData.append("Descripcion", descripcion);
      formData.append("Precio", precio);
      formData.append("Stock", stock);
      formData.append("CategoriaId", categoriaId.toString());

      // Enviamos ID de marca (o 1 por defecto)
      formData.append("MarcaId", marcaId ? marcaId.toString() : "1");

      if (nuevaImagen) {
        formData.append("Imagen", nuevaImagen);
      }

      await actualizarProducto(id, formData);
      alert("¡Producto actualizado correctamente!");
      router.push("/admin");

    } catch (error) {
      console.error("Error updating:", error);
      alert("Ocurrió un error al guardar.");
    } finally {
      setGuardando(false);
    }
  };

  if (loading) return <div className="p-10 text-center">Cargando...</div>;

  return (
    <div className="admin-wrapper">
      <Navbar />

      <main className="admin-container">
        <h1 className="admin-title">Editar Producto</h1>

        <form onSubmit={handleSubmit} className="admin-card">

          <div className="form-group">
            <label className="form-label">Nombre del Producto</label>
            <input
              type="text"
              className="form-input"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </div>

          <div className="form-row">
            <div>
              <label className="form-label">Categoría</label>
              <select
                className="form-input"
                value={categoriaId}
                onChange={(e) => setCategoriaId(Number(e.target.value))}
              >
                <option value={1}>Cables</option>
                <option value={2}>Iluminación</option>
                <option value={3}>Herramientas</option>
              </select>
            </div>

            <div>
              <label className="form-label">Marca</label>
              <SelectorMarca
                marcas={marcasDisponibles}
                marcaSeleccionadaId={marcaId}
                onSeleccionar={(id) => setMarcaId(id)}
                onNuevaMarcaCreada={handleNuevaMarca}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Descripción</label>
            <textarea
              className="form-textarea"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              required
            />
          </div>

          <div className="form-row">
            <div>
              <label className="form-label">Precio ($)</label>
              <input
                type="number"
                className="form-input"
                value={precio}
                onChange={(e) => setPrecio(e.target.value)}
                min="0"
                step="0.01"
                required
              />
            </div>
            <div>
              <label className="form-label">Stock Actual</label>
              <input
                type="number"
                className="form-input"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                min="0"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Imagen</label>

            {imagenActual && !nuevaImagen && (
              <div className="preview-box">
                <p className="preview-label">Imagen actual:</p>
                <img src={imagenActual} alt="Actual" className="preview-img" />
              </div>
            )}

            <input
              type="file"
              className="form-input"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files?.[0]) setNuevaImagen(e.target.files[0]);
              }}
            />
            <p className="hint-text">
              Dejá este campo vacío si no querés cambiar la imagen.
            </p>
          </div>

          <div className="form-actions">
            <button type="submit" disabled={guardando} className="btn-form-submit">
              {guardando ? "Guardando..." : "Guardar Cambios"}
            </button>

            <button type="button" onClick={() => router.back()} className="btn-cancel">
              Cancelar
            </button>
          </div>

        </form>
      </main>
    </div>
  );
}