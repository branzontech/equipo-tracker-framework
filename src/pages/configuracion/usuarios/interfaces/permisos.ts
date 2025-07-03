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
  ver: "productos.ver",
  editar: "productos.editar",
  eliminar: "productos.eliminar",
} as const;

export const PERMISOS_CONTRATOS = {
  lista: "contratos.lista",
  agregar: "contratos.agregar",
  tipos_licencias: "contratos.tipos.licencias",
  tipos_proveedores: "contratos.tipos.proveedores",
  tipos_software: "contratos.tipos.software",
} as const;

export const PERMISOS_SEDES = {
  ingreso: "configuracion.maestros.sedes.ingreso",
  edicion: "configuracion.maestros.sedes.edicion",
  eliminacion: "configuracion.maestros.sedes.eliminacion",
  listado: "configuracion.maestros.sedes.listado",
} as const;

export const PERMISOS_SUCURSALES = {
  ingreso: "configuracion.maestros.sucursales.ingreso",
  edicion: "configuracion.maestros.sucursales.edicion",
  eliminacion: "configuracion.maestros.sucursales.eliminacion",
  listado: "configuracion.maestros.sucursales.listado",
} as const;

export const PERMISOS_TIPOS = {
  ingreso: "configuracion.maestros.tipos.ingreso",
  edicion: "configuracion.maestros.tipos.edicion",
  eliminacion: "configuracion.maestros.tipos.eliminacion",
  listado: "configuracion.maestros.tipos.listado",
} as const;

export const PERMISOS_ESTADOS = {
  ingreso: "configuracion.maestros.estados.ingreso",
  edicion: "configuracion.maestros.estados.edicion",
  eliminacion: "configuracion.maestros.estados.eliminacion",
  listado: "configuracion.maestros.estados.listado",
} as const;

export const PERMISOS_PROVEEDORES = {
  ingreso: "configuracion.maestros.proveedores.ingreso",
  edicion: "configuracion.maestros.proveedores.edicion",
  eliminacion: "configuracion.maestros.proveedores.eliminacion",
  listado: "configuracion.maestros.proveedores.listado",
} as const;

export const PERMISOS_MARCAS = {
  ingreso: "configuracion.maestros.marcas.ingreso",
  edicion: "configuracion.maestros.marcas.edicion",
  eliminacion: "configuracion.maestros.marcas.eliminacion",
  listado: "configuracion.maestros.marcas.listado",
} as const;

export const PERMISOS_PERIFERICOS = {
  ingreso: "configuracion.maestros.perifericos.ingreso",
  edicion: "configuracion.maestros.perifericos.edicion",
  eliminacion: "configuracion.maestros.perifericos.eliminacion",
  listado: "configuracion.maestros.perifericos.listado",
} as const;

export const PERMISOS_CATEGORIAS = {
  ingreso: "configuracion.maestros.categorias.ingreso",
  edicion: "configuracion.maestros.categorias.edicion",
  eliminacion: "configuracion.maestros.categorias.eliminacion",
  listado: "configuracion.maestros.categorias.listado",
} as const;

export const PERMISOS_PERFILES_ACCESO = {
  ingreso: "configuracion.maestros.perfiles-acceso.ingreso",
  edicion: "configuracion.maestros.perfiles-acceso.edicion",
  eliminacion: "configuracion.maestros.perfiles-acceso.eliminacion",
  listado: "configuracion.maestros.perfiles-acceso.listado",
};

export const PERMISOS_TONERS = {
  toners: {
    ingreso: "toners.ingreso",
    salida: "toners.salida",
    movimientos: {
      historial: "toners.movimientos.historial",
    },
    existencia: "toners.existencia",
  },
  impresoras: {
    ingreso: "toners.impresoras.ingreso",
    edicion: "toners.impresoras.edicion",
    listado: "toners.impresoras.listado",
    eliminacion: "toners.impresoras.eliminacion",
  },
} as const;

export type ClavePermisoProducto = keyof typeof PERMISOS_PRODUCTOS;
export type ClavePermisoContrato = keyof typeof PERMISOS_CONTRATOS;
export type ClavePermisoSede = keyof typeof PERMISOS_SEDES;
export type ClavePermisoSucursal = keyof typeof PERMISOS_SUCURSALES;
export type ClavePermisoTipo = keyof typeof PERMISOS_TIPOS;
export type ClavePermisoEstado = keyof typeof PERMISOS_ESTADOS;
export type ClavePermisoProveedor = keyof typeof PERMISOS_PROVEEDORES;
export type ClavePermisoMarca = keyof typeof PERMISOS_MARCAS;
export type ClavePermisoPeriferico = keyof typeof PERMISOS_PERIFERICOS;
export type ClavePermisoCategoria = keyof typeof PERMISOS_CATEGORIAS;
export type ClavePermisoPerfilAcceso = keyof typeof PERMISOS_PERFILES_ACCESO;
export type ClavePermisoToner = keyof typeof PERMISOS_TONERS;
