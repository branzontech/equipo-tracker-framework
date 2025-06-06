import { Sucursal } from "@/pages/configuracion/maestros/interfaces/sucursales";

export interface Impresora {
  id_impresora: number;
  nombre: string;
  modelo: string;
  sucursal_id: Sucursal | number;
}