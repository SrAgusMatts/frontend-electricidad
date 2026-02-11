import { Producto } from "@/types";

export const agruparPorMarca = (productos: Producto[]) => {
  const grupos: { [nombreMarca: string]: Producto[] } = {};

  productos.forEach((prod) => {

    const nombreMarca = prod.marca?.nombre || "Otras Marcas";

    if (!grupos[nombreMarca]) {
      grupos[nombreMarca] = [];
    }

    grupos[nombreMarca].push(prod);
  });

  return grupos;
};