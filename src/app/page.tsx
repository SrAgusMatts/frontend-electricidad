import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
// Importamos la función y el tipo desde nuestro servicio nuevo
import { obtenerProductos, Producto } from "@/services/api";

export default async function Home() {
  // Una sola línea para traer los datos. ¡Magia! ✨
  const productos: Producto[] = await obtenerProductos();

  return (
    <div className="min-h-screen bg-gray-50 bg-opacity-50">
      <Navbar />

      <main className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            Materiales Eléctricos <span className="text-blue-600">Mattos</span>
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
            Calidad y confianza para tus proyectos e instalaciones.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
          {productos.map((prod) => (
            <ProductCard key={prod.id} producto={prod} />
          ))}
        </div>
        
        {productos.length === 0 && (
           <p className="text-center text-gray-500 mt-10">
             Cargando productos o sin conexión...
           </p>
        )}
      </main>
    </div>
  );
}