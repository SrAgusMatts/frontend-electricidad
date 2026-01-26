import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CarritoProvider } from "@/context/CarritoContext";
// 👇 1. Importar AuthProvider
import { AuthProvider } from "@/context/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Electricidad Mattos",
  description: "Tu tienda de electricidad de confianza",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={inter.className}>
        {/* 👇 2. Envolver todo con AuthProvider */}
        <AuthProvider>
          <CarritoProvider>
            {children}
          </CarritoProvider>
        </AuthProvider>
      </body>
    </html>
  );
}