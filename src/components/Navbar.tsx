import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-blue-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo / Nombre de la marca */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-xl font-bold tracking-wider hover:text-gray-200">
              ⚡ ELECTRICIDAD MATTOS
            </Link>
          </div>

          {/* Menú de la derecha */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link href="/" className="hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium">
                Inicio
              </Link>
              <Link href="/productos" className="hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium">
                Catálogo
              </Link>
              
              {/* Botón de Login (Por ahora solo visual) */}
              <Link 
                href="/login" 
                className="bg-yellow-500 text-blue-900 hover:bg-yellow-400 px-4 py-2 rounded-md text-sm font-bold transition-colors"
              >
                Ingresar
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}