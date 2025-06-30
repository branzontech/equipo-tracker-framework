export interface Permiso {
  id: number;
  nombre_permiso: string;
  descripcion: string;
  ruta_opcional: string;
}

export const PERMISOS_PRODUCTOS = {
  lista: "productos.lista",
  ingreso: "productos.ingreso",
  salidas: "productos.salidas",
  salidasPrestamos: "productos.salidas.prestamos",
  salidasTraslados: "productos.salidas.traslados",
  devoluciones: "productos.devoluciones",
  baja: "productos.baja",
  actas: "productos.actas",

  // Permisos de productos
  ver: "productos.ver",
  editar: "productos.editar",
  eliminar: "productos.eliminar",
} as const;

export type ClavePermisoProducto = keyof typeof PERMISOS_PRODUCTOS;
