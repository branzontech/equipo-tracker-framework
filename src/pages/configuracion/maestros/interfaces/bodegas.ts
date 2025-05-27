export interface Bodega {
  id: number;
  descripcion: string;
  responsables: string;
  estado: "Activo" | "Inactivo";
}